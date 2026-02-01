import { FaCircleQuestion, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel, Separator } from "@components";
import { DocSearchResults } from "./DocSearchResults";

interface HelpPanelProps {
  open: boolean;
  onClose: () => void;
}

export function HelpPanel({ open, onClose }: HelpPanelProps) {
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
      showSeparator={false}
    >
      <div className="flex flex-col h-full">
        <div className="mb-3">
          <DocSearchResults placeholder="Search documentation" />
          <Separator className="my-4" />
        </div>
        <div className="text-sm text-muted">
          Need help? Access guides, tips and developer docs in the full
          <a href="/docs" className="ml-1 underline hover:!text-info">
            documentation
          </a>
          .
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
