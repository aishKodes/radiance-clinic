#!/usr/bin/env python3
"""Import and audit the verified press-placement records supplied to Radiance.

The source files remain in the shared Drive folder. This script reads their public
link registers, deduplicates article URLs, checks the live pages, and writes only
the structured records and backlink audit needed by the website team.
"""

from __future__ import annotations

import csv
import html
import io
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import OrderedDict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

import openpyxl
import pypdf


ROOT = Path(__file__).resolve().parents[1]
AUDIT_PATH = ROOT / "seo" / "media-backlink-audit.csv"
REGISTRY_PATH = ROOT / "seo" / "media-import-records.json"
TIMEOUT_SECONDS = 15
USER_AGENT = "RadianceClinicsMediaAudit/1.0 (+https://www.radianceclinics.com/)"

HAIR_SHEET_URL = (
    "https://docs.google.com/spreadsheets/d/"
    "1MmeTZX8f0flT1U-xJm3lHOnPXpmmuxhe_pPjDDtDI8k/export?format=csv&gid=0"
)
LASER_WORKBOOK_URL = (
    "https://press-release-v1-new.s3.ap-south-1.amazonaws.com/order/69661/"
    "69661_order_link.xlsx"
)
REPORTS = (
    {
        "id": "1OGytcUnScCGGKxnDPhLQlSzTkqFUpIov",
        "source": "Dr. Satyartha PrakashSM50.pdf",
        "title": "Dr. Satyartha Prakash and the New Era of Aesthetic Dermatology",
        "topic": "aesthetic-dermatology",
        "source_date": "2026-09-14",
    },
    {
        "id": "13mAESI8LDS_u9M-zEww1HPuxEg-ioglb",
        "source": "Report_NWplus_170926 (1).pdf",
        "title": "Dr. Satyartha Prakash on the Changing Science of Pigmentation and Skin Care",
        "topic": "pigmentation",
        "source_date": "2026-09-15",
    },
)

TOPIC_DETAILS = {
    "hair-transplant": {
        "label": "Hair Transplant",
        "desired_target": "/hair-transplant-bhubaneswar",
        "summary": "An external profile discussing Dr. Satyartha Prakash's hair-transplant work in Odisha.",
    },
    "aesthetic-dermatology": {
        "label": "Aesthetic Dermatology",
        "desired_target": "/treatments/aesthetic-dermatology",
        "summary": "An external feature covering consultation-led aesthetic dermatology at Radiance Clinics.",
    },
    "laser-hair-reduction": {
        "label": "Laser Hair Reduction",
        "desired_target": "/laser-hair-removal-bhubaneswar",
        "summary": "An external feature about laser hair-reduction planning at Radiance Clinics in Bhubaneswar.",
    },
    "pigmentation": {
        "label": "Pigmentation & Skin Care",
        "desired_target": "/pigmentation-treatment-bhubaneswar",
        "summary": "An external feature about diagnosis-led pigmentation and skin-care planning at Radiance Clinics.",
    },
}


class DocumentMetadataParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.meta: dict[str, str] = {}
        self.links: list[dict[str, str]] = []
        self.title_parts: list[str] = []
        self.in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): value or "" for key, value in attrs}
        if tag == "meta":
            key = (values.get("property") or values.get("name") or "").lower()
            content = values.get("content", "").strip()
            if key and content and key not in self.meta:
                self.meta[key] = content
        elif tag == "link":
            rel = values.get("rel", "").lower()
            href = values.get("href", "").strip()
            if href:
                self.links.append({"rel": rel, "href": href})
        elif tag == "a":
            href = values.get("href", "").strip()
            if href:
                self.links.append({"rel": "anchor", "href": href})
        elif tag == "title":
            self.in_title = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)

    @property
    def title(self) -> str:
        return " ".join(part.strip() for part in self.title_parts if part.strip())


def request_bytes(url: str, maximum: int | None = None) -> tuple[bytes, str, str]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
        content = response.read(maximum) if maximum else response.read()
        return content, response.geturl(), response.headers.get_content_type()


def normalize_url(url: str) -> str:
    parsed = urllib.parse.urlsplit(html.unescape(url.strip()))
    if not parsed.scheme or not parsed.netloc:
        return ""
    kept_query = urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)
    kept_query = [
        (key, value)
        for key, value in kept_query
        if not key.lower().startswith("utm_")
    ]
    normalized_path = parsed.path or "/"
    if normalized_path != "/":
        normalized_path = normalized_path.rstrip("/") + "/"
    return urllib.parse.urlunsplit(
        (
            parsed.scheme.lower(),
            parsed.netloc.lower(),
            normalized_path,
            urllib.parse.urlencode(kept_query),
            "",
        )
    )


def is_external_article_url(url: str) -> bool:
    host = urllib.parse.urlsplit(url).netloc.lower()
    return bool(host) and not any(
        blocked in host
        for blocked in (
            "radianceclinics.com",
            "google.com",
            "amazonaws.com",
            "drive.google.com",
            "docs.google.com",
        )
    )


def outlet_from_host(url: str) -> str:
    host = urllib.parse.urlsplit(url).netloc.lower().removeprefix("www.")
    labels = re.sub(r"\.(co\.in|com|in|top|net|org)$", "", host).split(".")[0]
    return re.sub(r"[-_]+", " ", labels).title()


def outlet_from_document(
    outlet_hint: str, site_name: str, page_title: str, article_url: str
) -> str:
    if outlet_hint:
        return outlet_hint.strip()

    candidate = site_name.strip()
    if candidate and candidate.lower() not in {"english", "news", "home"}:
        return candidate

    title_parts = [
        part.strip()
        for part in re.split(r"\||\u2013|\u2014|-", page_title)
        if part.strip()
    ]
    if len(title_parts) > 1:
        return title_parts[-1]
    return outlet_from_host(article_url)


def pdf_links(file_id: str) -> list[str]:
    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    payload, _, _ = request_bytes(url)
    reader = pypdf.PdfReader(io.BytesIO(payload))
    links: list[str] = []
    for page in reader.pages:
        for annotation_ref in page.get("/Annots") or []:
            annotation = annotation_ref.get_object()
            uri = (annotation.get("/A") or {}).get("/URI")
            if isinstance(uri, str):
                links.append(uri)
    return links


def source_records() -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []

    hair_csv, _, _ = request_bytes(HAIR_SHEET_URL)
    for row in csv.DictReader(io.StringIO(hair_csv.decode("utf-8-sig"))):
        url = (row.get("LIVE LINK") or "").strip()
        if url:
            records.append(
                {
                    "article_url": url,
                    "outlet_hint": "",
                    "title": "Dr. Satyartha Prakash and the Evolution of Hair Transplantation in Odisha",
                    "topic": "hair-transplant",
                    "source_date": "",
                    "source": "SM 3208 Google Sheets",
                }
            )

    for report in REPORTS:
        for url in pdf_links(report["id"]):
            if is_external_article_url(url):
                records.append(
                    {
                        "article_url": url,
                        "outlet_hint": "",
                        "title": report["title"],
                        "topic": report["topic"],
                        "source_date": report["source_date"],
                        "source": report["source"],
                    }
                )

    workbook_bytes, _, _ = request_bytes(LASER_WORKBOOK_URL)
    workbook = openpyxl.load_workbook(
        io.BytesIO(workbook_bytes), read_only=True, data_only=True
    )
    sheet = workbook.active
    for number, outlet, _audience, url in sheet.iter_rows(min_row=2, values_only=True):
        if isinstance(url, str) and is_external_article_url(url):
            records.append(
                {
                    "article_url": url,
                    "outlet_hint": str(outlet or "").strip(),
                    "title": "Dr. Satyartha Prakash and the Rise of Laser Hair Reduction in Bhubaneswar",
                    "topic": "laser-hair-reduction",
                    "source_date": "2026-09-15",
                    "source": "PR-0926-1007 publisher workbook",
                    "source_reference": str(number or ""),
                }
            )

    deduped: OrderedDict[str, dict[str, Any]] = OrderedDict()
    for record in records:
        key = normalize_url(record["article_url"])
        if not key:
            continue
        if key in deduped:
            deduped[key].setdefault("duplicate_sources", []).append(record["source"])
            continue
        record["article_url"] = key
        deduped[key] = record
    return list(deduped.values())


def to_absolute_url(base_url: str, value: str) -> str:
    parsed = urllib.parse.urljoin(base_url, value)
    return parsed if parsed.startswith(("http://", "https://")) else ""


def page_audit(record: dict[str, Any]) -> dict[str, Any]:
    article_url = record["article_url"]
    topic_details = TOPIC_DETAILS[record["topic"]]
    result = {
        **record,
        "outlet_name": record.get("outlet_hint") or outlet_from_host(article_url),
        "publication_date": "",
        "date_source": "",
        "official_logo_url": "",
        "canonical_article_url": "",
        "page_title": "",
        "http_status": "unverified",
        "verification_status": "not checked",
        "backlink_present": "no",
        "current_backlink_target": "",
        "desired_radiance_target": topic_details["desired_target"],
        "topic_label": topic_details["label"],
        "summary": topic_details["summary"],
        "outreach_priority": "review source",
    }

    try:
        payload, final_url, content_type = request_bytes(article_url, maximum=1_500_000)
        if "html" not in content_type:
            result["http_status"] = content_type or "non-html response"
            result["verification_status"] = "not a readable article page"
            return result

        parser = DocumentMetadataParser()
        parser.feed(payload.decode("utf-8", errors="replace"))
        result["http_status"] = "200"
        result["canonical_article_url"] = final_url
        result["page_title"] = (
            parser.meta.get("og:title") or parser.title or record["title"]
        ).strip()
        result["outlet_name"] = outlet_from_document(
            record.get("outlet_hint", ""),
            parser.meta.get("og:site_name")
            or parser.meta.get("application-name")
            or "",
            result["page_title"],
            article_url,
        )

        published = (
            parser.meta.get("article:published_time")
            or parser.meta.get("date")
            or parser.meta.get("publish-date")
            or parser.meta.get("pubdate")
        )
        if published:
            result["publication_date"] = published
            result["date_source"] = "article metadata"
        elif record.get("source_date"):
            result["publication_date"] = record["source_date"]
            result["date_source"] = "placement report"

        for link in parser.links:
            absolute = to_absolute_url(final_url, link["href"])
            if not absolute:
                continue
            if link["rel"] != "anchor" and "icon" in link["rel"]:
                logo_host = urllib.parse.urlsplit(absolute).netloc.lower()
                article_host = urllib.parse.urlsplit(final_url).netloc.lower()
                if logo_host == article_host and not result["official_logo_url"]:
                    result["official_logo_url"] = absolute
            if link["rel"] == "anchor" and "radianceclinics.com" in absolute.lower():
                result["backlink_present"] = "yes"
                result["current_backlink_target"] = absolute

        title_tokens = {
            token
            for token in re.findall(r"[a-z]{5,}", record["title"].lower())
            if token not in {"satyartha", "prakash", "radiance", "clinics"}
        }
        page_tokens = set(re.findall(r"[a-z]{5,}", result["page_title"].lower()))
        title_matches = len(title_tokens & page_tokens)
        if title_matches >= 2 and result["publication_date"]:
            result["verification_status"] = "verified live article"
        elif title_matches >= 1:
            result["verification_status"] = "live article; date needs review"
        else:
            result["verification_status"] = "live URL; title needs review"

        desired_absolute = f"https://www.radianceclinics.com{topic_details['desired_target']}"
        current = result["current_backlink_target"].replace("http://", "https://")
        if not result["backlink_present"] == "yes":
            result["outreach_priority"] = "high"
        elif current.rstrip("/") == desired_absolute.rstrip("/"):
            result["outreach_priority"] = "low"
        else:
            result["outreach_priority"] = "medium"
    except urllib.error.HTTPError as error:
        result["http_status"] = str(error.code)
        result["verification_status"] = "unavailable"
    except Exception as error:  # Source sites frequently fail in different ways.
        result["http_status"] = "error"
        result["verification_status"] = f"unavailable: {type(error).__name__}"

    return result


def main() -> None:
    records = source_records()
    audited: list[dict[str, Any]] = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(page_audit, record): record for record in records}
        for future in as_completed(futures):
            audited.append(future.result())

    audited.sort(key=lambda item: (item["topic"], item["outlet_name"].lower(), item["article_url"]))
    fetched_at = datetime.now(timezone.utc).isoformat()
    for item in audited:
        item["audited_at"] = fetched_at

    REGISTRY_PATH.write_text(
        json.dumps(
            {
                "generatedAt": fetched_at,
                "sourceCount": len(records),
                "records": audited,
            },
            indent=2,
            ensure_ascii=True,
        )
        + "\n",
        encoding="utf-8",
    )

    fieldnames = [
        "outlet",
        "article URL",
        "backlink present yes/no",
        "current backlink target",
        "desired Radiance target page",
        "outreach priority",
        "verification status",
        "topic",
        "publication date",
        "official logo URL",
        "source record",
        "audited at",
    ]
    with AUDIT_PATH.open("w", newline="", encoding="utf-8") as output:
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        for item in audited:
            writer.writerow(
                {
                    "outlet": item["outlet_name"],
                    "article URL": item["article_url"],
                    "backlink present yes/no": item["backlink_present"],
                    "current backlink target": item["current_backlink_target"],
                    "desired Radiance target page": item["desired_radiance_target"],
                    "outreach priority": item["outreach_priority"],
                    "verification status": item["verification_status"],
                    "topic": item["topic_label"],
                    "publication date": item["publication_date"],
                    "official logo URL": item["official_logo_url"],
                    "source record": item["source"],
                    "audited at": item["audited_at"],
                }
            )

    print(f"Audited {len(audited)} unique media records.")
    print(f"Wrote {AUDIT_PATH.relative_to(ROOT)}")
    print(f"Wrote {REGISTRY_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
