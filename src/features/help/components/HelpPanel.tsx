import { useEffect, useState } from "react";
import { FaBookOpen, FaXmark } from "react-icons/fa6";
import {
  ActionButton,
  MenuButton,
  Panel,
  SectionHeader,
  Separator,
} from "@components";
import { DOCS, DEV_DOCS, DOCS_PATH } from "../config/docs";

interface HelpPanelProps {
  open: boolean;
  onClose: () => void;
}

export function HelpPanel({ open, onClose }: HelpPanelProps) {
  const [selected, setSelected] = useState(DOCS[0].file);
  const [content, setContent] = useState("");

  // Fetch doc content when selected changes
  useEffect(() => {
    fetch(DOCS_PATH + selected)
      .then((res) => res.text())
      .then(setContent)
      .catch(() => setContent("Documentation not found."));
  }, [selected]);

  return (
    <Panel
      show={open}
      onHide={onClose}
      position="right"
      title={
        <>
          <FaBookOpen className="mr-2" /> Help & Documentation
        </>
      }
      headerActions={
        <ActionButton
          onClick={onClose}
          ariaLabel="Close help panel"
          title="Close"
          icon={<FaXmark className="text-2xl" />}
          rounded
        />
      }
      className="!z-[10050]"
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <ul style={{ listStyle: "none", padding: 0 }}>
            <SectionHeader className="mt-2 mb-1">Using Atlaset</SectionHeader>
            {DOCS.map((doc) => (
              <li key={doc.file}>
                <MenuButton
                  onClick={() => setSelected(doc.file)}
                  active={selected === doc.file}
                  icon={doc.icon}
                  ariaLabel={doc.label}
                  className="w-full"
                >
                  {doc.label}
                </MenuButton>
              </li>
            ))}
            {DEV_DOCS && DEV_DOCS.length > 0 && (
              <>
                <SectionHeader className="mt-4 mb-1">
                  For Developers
                </SectionHeader>
                {DEV_DOCS.map((doc) => (
                  <li key={doc.file}>
                    <MenuButton
                      onClick={() => setSelected(doc.file)}
                      active={selected === doc.file}
                      icon={doc.icon}
                      ariaLabel={doc.label}
                      className="w-full"
                    >
                      {doc.label}
                    </MenuButton>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
        <Separator className="my-2" />
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Use a markdown renderer here if available */}
          <div style={{ whiteSpace: "pre-wrap" }}>{content}</div>
        </div>
      </div>
    </Panel>
  );
}
