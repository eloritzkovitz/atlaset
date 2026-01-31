import { useState } from "react";
import { FaBookOpen, FaCircleQuestion, FaXmark } from "react-icons/fa6";
import {
  ActionButton,
  MenuButton,
  Panel,
  SearchInput,
  SectionHeader,
  Separator,
} from "@components";
import { useDocSearch } from "../hooks/useDocSearch";

interface HelpPanelProps {
  open: boolean;
  onClose: () => void;
}

export function HelpPanel({ open, onClose }: HelpPanelProps) {
  const [search, setSearch] = useState("");
  const { searchResults } = useDocSearch(search);

  return (
    <Panel
      show={open}
      onHide={onClose}
      position="right"
      title={
        <>
          <FaCircleQuestion className="mr-2" /> Help
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
        <SectionHeader className="mt-2 mb-1">Documentation</SectionHeader>
        <div className="mb-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search documentation"
            className="mb-0"
          />
        </div>
        {search.trim().length > 0 && (
          <div className="mb-3">
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((doc) => (
                  <li key={doc.file}>
                    <MenuButton
                      icon={doc.icon}
                      className="w-full mb-1"
                      onClick={() =>
                        (window.location.href = `/documentation/${doc.file.replace(/\.md$/, "")}`)
                      }
                    >
                      {doc.label}
                    </MenuButton>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted px-2">No results found.</div>
            )}
            <Separator className="my-2" />
          </div>
        )}
        <MenuButton
          onClick={() => (window.location.href = "/documentation")}
          icon={<FaBookOpen />}
          className="w-full mb-4"
        >
          Open Documentation
        </MenuButton>
        <Separator className="my-2" />
        <div className="text-sm text-muted">
          Need help? Access guides, tips and developer docs in the full
          documentation.
        </div>
        <div className="flex mt-4 text-sm font-semibold items-start gap-2">
          <a href="/about" className="ml-3 hover:!text-info">
            About
          </a>
          <a href="/changelog" className="ml-3 hover:!text-info">
            Changelog
          </a>
        </div>
      </div>
    </Panel>
  );
}
