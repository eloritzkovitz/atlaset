import { Link } from "react-router-dom";
import { Card, MenuButton } from "@components";

export function DocsNotFound() {
  return (
    <div className="w-full max-w-2xl">
      <Card className="p-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
        <p className="text-muted mb-4">
          The page you are looking for doesn&apos;t exist or has been moved.
          <br />
          Please check the URL or return to the homepage.
        </p>
        <div className="flex justify-center gap-2">
          <Link to="/docs">
            <MenuButton icon={<></>} ariaLabel="Docs Home">
              Docs Home
            </MenuButton>
          </Link>
        </div>
      </Card>
    </div>
  );
}
