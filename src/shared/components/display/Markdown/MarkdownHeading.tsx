import { ICONS } from "@constants/icons";
import { ActionButton } from "../../inputs/Button/ActionButton";

/** Copies a heading's direct URL to the clipboard. */
async function copySectionLink(id: string): Promise<void> {
  const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${id}`;

  await navigator.clipboard.writeText(url);
}

/** Renders a markdown heading with a copyable section link. */
export function MarkdownHeading({
  level,
  id,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  level: 2 | 3;
}) {
  const handleCopyLink = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!id) return;

    await copySectionLink(id);
  };

  const content = (
    <>
      {id ? (
        <a
          href={`#${id}`}
          className="text-inherit no-underline hover:text-inherit"
        >
          {children}
        </a>
      ) : (
        children
      )}

      {id && (
        <ActionButton
          icon={<ICONS.copyLink className="h-5 w-5" />}
          ariaLabel="Copy section link"
          title="Copy section link"
          variant="custom"
          className="h-7 w-7 shrink-0 text-sm text-muted opacity-0 transition-opacity hover:text-action-text-hover group-hover:opacity-100 focus-visible:opacity-100"
          onClick={handleCopyLink}
        />
      )}
    </>
  );

  const headingClassName = `group flex items-center gap-2 ${className ?? ""}`;

  switch (level) {
    case 2:
      return (
        <h2 id={id} className={headingClassName} {...props}>
          {content}
        </h2>
      );

    case 3:
      return (
        <h3 id={id} className={headingClassName} {...props}>
          {content}
        </h3>
      );
  }
}
