import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const root = process.cwd();
const sourceDirectory = path.resolve(
  process.env.DOCTOR_ARTICLES_SOURCE || path.join(root, "..", "5-blog-drsatyarth"),
);
const outputFile = path.join(root, "src/data/doctor-articles.generated.ts");
const mediaDirectory = path.join(root, "public/radiance-media-processed/articles");
const publishedAt = "2026-09-19";

const articleConfig = [
  {
    file: "adult-acne-hormones-pcos-insulin-resistance-bhubaneswar.md",
    slug: "adult-acne-hormones-pcos-insulin-resistance-bhubaneswar",
    category: "Acne & Skin Health",
    excerpt:
      "Adult acne can begin after adolescence. Dr. Satyarth explains when hormonal history, PCOS or insulin resistance may matter and when testing is useful.",
    image: "/radiance-media-processed/landscape/radiance-acne-condition.webp",
    imageAlt: "Adult acne with inflamed breakouts on the cheek",
    relatedTreatments: ["/acne-treatment-bhubaneswar", "/skin-clinic-bhubaneswar"],
    relatedConditions: ["/concerns/acne/adult-acne", "/conditions/acne-acne-scars"],
    relatedArticles: ["acne-scar-types-and-treatment-planning", "acne-scar-treatment-bhubaneswar"],
    references: [
      {
        label: "American Academy of Dermatology: Adult acne treatment",
        href: "https://www.aad.org/public/diseases/acne/diy/adult-acne-treatment",
      },
      {
        label: "International evidence-based guideline for PCOS assessment and management (2023)",
        href: "https://www.monash.edu/__data/assets/pdf_file/0003/3379521/Evidence-Based-Guidelines-2023.pdf",
      },
    ],
  },
  {
    file: "bhubaneswar-water-hair-fall-hard-water.md",
    slug: "bhubaneswar-water-hair-fall-hard-water",
    category: "Hair & Scalp Health",
    excerpt:
      "Hard water can contribute to roughness and breakage, but it is not the same as hair shedding or progressive thinning. Dr. Satyarth explains what to assess.",
    sourceImage: "ChatGPT Image Sep 18, 2026, 11_15_17 PM.png",
    image: "/radiance-media-processed/articles/bhubaneswar-water-hair-fall-hard-water.webp",
    imageAlt: "Person examining wet hair and scalp after washing",
    relatedTreatments: ["/hair-loss-clinic-bhubaneswar", "/treatments/hair-restoration/advanced-hair-fall-solutions"],
    relatedConditions: ["/concerns/hair-loss-scalp/hair-loss", "/conditions/hair-fall-thinning"],
    relatedArticles: ["hair-loss-causes-and-assessment", "how-to-plan-hair-restoration"],
    references: [
      {
        label: "Assessment of water quality in the piped water supply system in Bhubaneswar city",
        href: "https://assets-eu.researchsquare.com/files/rs-4154006/v1/04727131-d540-4aba-845e-ea32aef53970.pdf?c=1718639460",
      },
      {
        label: "American Academy of Dermatology: Hair loss diagnosis and treatment",
        href: "https://www.aad.org/public/diseases/hair-loss/treatment/diagnosis-treat",
      },
    ],
  },
  {
    file: "exosome-skin-treatment-bhubaneswar.md",
    slug: "exosome-skin-treatment-bhubaneswar",
    category: "Aesthetic Dermatology",
    excerpt:
      "A doctor-authored assessment of exosome skin treatments, including the current evidence, safety questions and how to compare them with established procedures.",
    sourceImage: "Radiance Clinic_ Skin Science Glow.png",
    image: "/radiance-media-processed/articles/exosome-skin-treatment-bhubaneswar.webp",
    imageAlt: "Illustration of a patient in a clinical skin-care setting with cellular science imagery",
    relatedTreatments: ["/treatments/aesthetic-dermatology", "/skin-clinic-bhubaneswar"],
    relatedConditions: ["/conditions/skin-ageing-laxity", "/conditions/acne-acne-scars"],
    relatedArticles: ["laser-skin-treatments-safety", "premium-aesthetic-consultation"],
    references: [
      {
        label: "FDA consumer alert on regenerative medicine products, including exosomes",
        href: "https://www.fda.gov/vaccines-blood-biologics/consumers-biologics/consumer-alert-regenerative-medicine-products-including-stem-cells-and-exosomes",
      },
      {
        label: "PubMed: Exosomes in dermatology, clinical evidence and future directions",
        href: "https://pubmed.ncbi.nlm.nih.gov/40533901/",
      },
    ],
  },
  {
    file: "why-tanning-despite-sunscreen-bhubaneswar.md",
    slug: "why-tanning-despite-sunscreen-bhubaneswar",
    category: "Pigmentation & Skin Health",
    excerpt:
      "Why skin can continue to darken despite sunscreen in Bhubaneswar's heat and humidity, and when persistent pigmentation needs a diagnosis rather than another product.",
    sourceImage: "ChatGPT Image Sep 18, 2026, 11_44_57 PM.png",
    image: "/radiance-media-processed/articles/why-tanning-despite-sunscreen-bhubaneswar.webp",
    imageAlt: "Woman applying sunscreen outdoors in Bhubaneswar sun",
    relatedTreatments: ["/pigmentation-treatment-bhubaneswar", "/treatments/skin-laser/laser-pigmentation-program"],
    relatedConditions: ["/concerns/pigmentation/tanning", "/conditions/pigmentation-melasma"],
    relatedArticles: ["laser-skin-treatments-safety", "best-skin-clinic-bhubaneswar"],
    references: [
      {
        label: "American Academy of Dermatology: Sunscreen FAQs",
        href: "https://www.aad.org/media/stats-sunscreen",
      },
      {
        label: "American Academy of Dermatology: How to decode a sunscreen label",
        href: "https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/understand-sunscreen-labels",
      },
    ],
  },
  {
    file: "acne-scar-treatment-bhubaneswar.md",
    slug: "acne-scar-treatment-bhubaneswar",
    category: "Acne Scar Treatment",
    excerpt:
      "Dr. Satyarth explains why scar type, active acne control, skin type and realistic downtime matter more than travelling to a larger city for acne-scar treatment.",
    sourceImage: "ChatGPT Image Sep 18, 2026, 11_12_21 PM.png",
    image: "/radiance-media-processed/articles/acne-scar-treatment-bhubaneswar.webp",
    imageAlt: "Person examining acne scars and active acne in a mirror",
    relatedTreatments: ["/acne-scar-treatment-bhubaneswar", "/treatments/skin-laser/acne-scar-revision"],
    relatedConditions: ["/concerns/acne-scars/acne-scars", "/conditions/acne-acne-scars"],
    relatedArticles: ["acne-scar-types-and-treatment-planning", "adult-acne-hormones-pcos-insulin-resistance-bhubaneswar"],
    references: [
      {
        label: "American Academy of Dermatology: Acne scars consultation and treatment",
        href: "https://www.aad.org/public/diseases/acne/derm-treat/scars/treatment",
      },
      {
        label: "American Academy of Dermatology: Acne scars signs and symptoms",
        href: "https://www.aad.org/public/diseases/acne/derm-treat/scars/symptoms",
      },
    ],
  },
];

function cleanTitle(value) {
  return value.replace(/^\*\*|\*\*$/g, "").trim();
}

function parseMarkdown(markdown) {
  const blocks = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let title = "";
  let started = false;
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
    paragraph = [];
  };

  const flushList = () => {
    if (!list?.items.length) return;
    blocks.push(list);
    list = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === "---") {
      flushParagraph();
      flushList();
      continue;
    }

    const h1 = line.match(/^#\s+(.+)$/);
    if (h1) {
      title = cleanTitle(h1[1]);
      started = true;
      continue;
    }

    if (!started) continue;

    // Source files may retain their private SEO brief below the H1. It informs
    // this importer but is not patient-facing article copy.
    if (/^\*\*(?:SEO Title|Meta Title|Meta Description|Suggested URL(?: Slug)?|Primary Keyword|Secondary Keywords):\*\*/i.test(line)) {
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: heading[1].length === 2 ? 2 : 3,
        text: cleanTitle(heading[2]),
      });
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const nextList = {
        type: "list",
        ordered: Boolean(ordered),
        items: [],
      };
      if (!list || list.ordered !== nextList.ordered) {
        flushList();
        list = nextList;
      }
      list.items.push((unordered || ordered)[1].trim());
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return { title, blocks };
}

function estimateReadTime(blocks) {
  const words = blocks
    .flatMap((block) => (block.type === "list" ? block.items : [block.text]))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(4, Math.ceil(words / 220))} min read`;
}

async function optimizeMedia(config) {
  if (!config.sourceImage) return;
  const source = path.join(sourceDirectory, config.sourceImage);
  const destination = path.join(root, "public", config.image);
  await mkdir(path.dirname(destination), { recursive: true });
  await sharp(source)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(destination);
}

async function main() {
  await mkdir(mediaDirectory, { recursive: true });

  const articles = await Promise.all(
    articleConfig.map(async (config) => {
      const markdown = await readFile(path.join(sourceDirectory, config.file), "utf8");
      const { title, blocks } = parseMarkdown(markdown);
      if (!title || !blocks.length) throw new Error(`Could not parse ${config.file}`);
      await optimizeMedia(config);

      return {
        slug: config.slug,
        title,
        category: config.category,
        readTime: estimateReadTime(blocks),
        excerpt: config.excerpt,
        body: blocks
          .filter((block) => block.type === "paragraph")
          .map((block) => block.text)
          .slice(0, 3),
        content: blocks,
        image: {
          src: config.image,
          desktopUrl: config.image,
          uncroppedUrl: config.image,
          alt: config.imageAlt,
          altText: config.imageAlt,
          displayMode: "cover",
        },
        seoTitle:
          config.slug === "adult-acne-hormones-pcos-insulin-resistance-bhubaneswar"
            ? "Adult Acne, Hormones & PCOS in Bhubaneswar | Radiance Clinics"
            : config.slug === "bhubaneswar-water-hair-fall-hard-water"
              ? "Is Bhubaneswar Water Causing Hair Fall? | Radiance Clinics"
              : config.slug === "exosome-skin-treatment-bhubaneswar"
                ? "Exosome Skin Treatment in Bhubaneswar: Evidence & Safety | Radiance Clinics"
                : config.slug === "why-tanning-despite-sunscreen-bhubaneswar"
                  ? "Why Am I Still Tanning Despite Sunscreen? | Radiance Clinics"
                  : "Acne Scar Treatment in Bhubaneswar: A Doctor's Guide | Radiance Clinics",
        seoDescription: config.excerpt,
        authorName: "Dr. Satyarth Prakash",
        authorType: "doctor",
        authorId: "dr-satyarth-prakash",
        publishedAt,
        updatedAt: publishedAt,
        medicalReviewStatus: "PUBLISHED",
        sourceType: "original",
        references: config.references,
        relatedTreatments: config.relatedTreatments,
        relatedConditions: config.relatedConditions,
        relatedArticles: config.relatedArticles,
      };
    }),
  );

  await writeFile(
    outputFile,
    `// Generated from Dr. Satyarth Prakash's approved source articles.\nimport type { Article } from "@/types/cms";\n\nexport const doctorArticles: Article[] = ${JSON.stringify(articles, null, 2)};\n`,
  );
  console.log(`Imported ${articles.length} doctor-authored articles and optimized source images.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
