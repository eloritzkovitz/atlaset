import { FaCircleUser } from "react-icons/fa6";

interface UserAvatarProps {
  user: any;
  size?: number;
  className?: string;
}

export function UserAvatar({
  user,
  size = 40,
  className = "",
}: UserAvatarProps) {
  const sizeClass = `w-[${size}px] h-[${size}px]`;
  return user && user.photoURL ? (
    <img
      src={user.photoURL}
      alt="User avatar"
      className={`rounded-full object-cover ${sizeClass} ${className}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className={`flex items-center justify-center rounded-full bg-gray-200 text-gray-500 ${sizeClass} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.8 }}
    >
      <FaCircleUser style={{ width: size * 0.8, height: size * 0.8 }} />
    </span>
  );
}
