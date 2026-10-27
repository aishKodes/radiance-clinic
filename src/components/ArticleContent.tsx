import type { ReactNode } from "react";
import type { CmsArticleContentBlock } from "@/types/cms";
import { articleInlineTokens } from "@/lib/article-inline";

type ArticleContentProps = {
  body: string[];
  content?: CmsArticleContentBlock[];
};

function renderInline(value: string): ReactNode[] {
  return articleInlineTokens(value).map((part, index) => {
    if (part.type === "link") {
      const external = part.href.startsWith("http");
      return <a key={index} href={part.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="break-words font-bold text-[var(--aqua)] underline underline-offset-4 [overflow-wrap:anywhere]">{part.text}</a>;
    }
    if (part.type === "strong") return <strong key={index} className="font-extrabold text-[#151515]">{part.text}</strong>;
    if (part.type === "em") return <em key={index}>{part.text}</em>;
    return part.text;
  });
}

export function ArticleContent({ body, content }: ArticleContentProps) {
  if (!content?.length) {
    return (
      <div className="space-y-7 text-xl leading-9 text-[#151515]/72">
        {body.map((paragraph) => (
          <p key={paragraph}>{renderInline(paragraph)}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="text-lg leading-8 text-[#151515]/72 sm:text-xl sm:leading-9">
      {content.map((block, index) => {
        if (block.type === "heading") {
          const Heading = block.level === 2 ? "h2" : "h3";
          const className =
            block.level === 2
              ? "mt-14 font-serif text-4xl leading-[1.02] text-[#151515] sm:text-5xl"
              : "mt-10 text-2xl font-extrabold leading-tight text-[#151515]";

          return <Heading key={`${block.text}-${index}`} className={className}>{renderInline(block.text)}</Heading>;
        }

        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List
              key={`${block.items[0]}-${index}`}
              className={`my-7 space-y-3 pl-6 ${block.ordered ? "list-decimal" : "list-disc"}`}
            >
              {block.items.map((item) => <li key={item}>{renderInline(item)}</li>)}
            </List>
          );
        }

        return <p key={`${block.text}-${index}`} className="mt-7">{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
