import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a product's long description from structured markdown so H2s,
 * lists, tables and links become real HTML. Internal links (starting with "/")
 * route client-side; external links open in a new tab.
 */
export function ProductDescription({ content }: { content: string }) {
  if (!content?.trim()) {
    return <p className="text-muted-foreground">No description available.</p>;
  }

  return (
    <div className="max-w-none text-muted-foreground">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-8 text-xl font-black text-primary first:mt-0 md:text-2xl">{children}</h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 text-xl font-black text-primary first:mt-0 md:text-2xl">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 text-base font-bold text-primary">{children}</h3>
          ),
          p: ({ children }) => <p className="mt-3 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="mt-3 space-y-1.5 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="mt-3 list-decimal space-y-1.5 pl-5">{children}</ol>,
          li: ({ children }) => (
            <li className="relative pl-1 leading-relaxed marker:text-accent list-disc">{children}</li>
          ),
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          table: ({ children }) => (
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-muted/60 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="border-t border-border px-4 py-2.5 text-foreground">{children}</td>,
          a: ({ href, children }) => {
            const url = href ?? "#";
            const internal = url.startsWith("/");
            return (
              <a
                href={url}
                {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                className="font-semibold text-accent underline underline-offset-2 hover:brightness-90"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
