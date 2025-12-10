import { Link } from "react-router-dom";

interface AuthFooterProps {
  prompt: string;
  linkText: string;
  linkTo: string;
  linkClass?: string;
}

export function AuthFooter({
  prompt,
  linkText,
  linkTo,
  linkClass,
}: AuthFooterProps) {
  return (
    <div className="mt-8 text-center text-gray-700">
      {prompt}{" "}
      <Link
        to={linkTo}
        className={
          linkClass ??
          "text-primary font-semibold underline-offset-4 hover:underline transition-colors"
        }
      >
        {linkText}
      </Link>
    </div>
  );
}
