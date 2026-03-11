import { ActionButton, Panel } from "@components";
import { ICONS } from "@constants/icons";
import { SearchContent } from "./SearchContent";

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SearchPanel({ open, onClose }: SearchPanelProps) {
  return (
    <Panel
      show={open}
      onHide={onClose}
      position="right"
      title={
        <>
          <ICONS.search className="mr-2" /> Search
        </>
      }
      headerActions={
        <ActionButton
          onClick={onClose}
          ariaLabel="Close search panel"
          title="Close"
          icon={<ICONS.close className="text-2xl" />}
          rounded
        />
      }
      className="!z-[10050]"
      showSeparator={false}
    >
      <SearchContent containerClassName="!z-[10051]" />
    </Panel>
  );
}
