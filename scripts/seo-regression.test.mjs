import test from "node:test";
import assert from "node:assert/strict";
import { validatePage } from "./seo-regression.mjs";

const expected = {
  path: "/skin-clinic-bhubaneswar",
  title: "Skin Clinic",
  h1: "Skin Clinic",
};
const good = {
  status: 200,
  robots: "index,follow",
  canonical: "https://www.radianceclinics.com/skin-clinic-bhubaneswar",
  inSitemap: true,
  h1Count: 1,
  title: "Skin Clinic",
  h1: "Skin Clinic",
  inboundLink: true,
  schemaValid: true,
};
test("unchanged protected page passes", () =>
  assert.deepEqual(validatePage(expected, good), []));
for (const [key, value] of Object.entries({
  status: 404,
  robots: "noindex,follow",
  canonical: "https://www.radianceclinics.com/",
  inSitemap: false,
  h1Count: 2,
  title: "Changed",
  h1: "Changed",
  inboundLink: false,
  schemaValid: false,
})) {
  test(`rejects ${key} regression`, () =>
    assert.ok(validatePage(expected, { ...good, [key]: value }).length));
}
