import { ActionButton } from "@components";

interface GoogleSignInButtonProps {
  onClick: () => void;
  text?: string;
}

export function GoogleSignInButton({
  onClick,
  text = "Sign in with Google",
}: GoogleSignInButtonProps) {
  return (
    <ActionButton
      onClick={onClick}
      variant="secondary"
      className="w-full !rounded-full !bg-secondary !hover:bg-secondary-hover text-gray-700"
      type="button"
    >
      <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
        <g>
          <path
            fill="#4285F4"
            d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.34 2.34 30.55 0 24 0 14.64 0 6.4 5.48 2.44 13.44l7.93 6.17C12.45 13.14 17.77 9.5 24 9.5z"
          />
          <path
            fill="#34A853"
            d="M46.09 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.91-2.17 5.38-4.62 7.04l7.19 5.59C43.98 37.36 46.09 31.44 46.09 24.5z"
          />
          <path
            fill="#FBBC05"
            d="M10.37 28.61c-1.09-3.22-1.09-6.7 0-9.92l-7.93-6.17C.64 16.36 0 20.09 0 24c0 3.91.64 7.64 2.44 11.48l7.93-6.17z"
          />
          <path
            fill="#EA4335"
            d="M24 48c6.55 0 12.34-2.17 16.44-5.91l-7.19-5.59c-2.01 1.35-4.59 2.16-7.25 2.16-6.23 0-11.55-3.64-13.63-8.93l-7.93 6.17C6.4 42.52 14.64 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </g>
      </svg>
      <span className="font-medium">{text}</span>
    </ActionButton>
  );
}
