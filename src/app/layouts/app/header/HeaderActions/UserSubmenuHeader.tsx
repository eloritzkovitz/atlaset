import { ActionButton, DirectionalIcon, Separator } from "@components";

interface UserSubmenuHeaderProps {
  title: string;
  onBack: () => void;
}

export function UserSubmenuHeader({ title, onBack }: UserSubmenuHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <ActionButton
          onClick={onBack}
          icon={
            <DirectionalIcon
              direction="prev"
              variant="chevron"
              className="text-lg"
            />
          }
          rounded
        />
        <span className="text-lg font-bold">{title}</span>
      </div>
      <Separator className="my-2" />
    </>
  );
}
