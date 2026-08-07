import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaLink,
  FaXTwitter,
} from "react-icons/fa6";

const ICONS: Record<string, React.ReactNode> = {
  x: <FaXTwitter />,
  instagram: <FaInstagram />,
  facebook: <FaFacebook />,
  linkedin: <FaLinkedin />,
  github: <FaGithub />,
  website: <FaLink />,
};

interface SocialIconProps {
  platform: string;
  fallback?: React.ReactNode;
}

export function SocialIcon({
  platform,
  fallback = <FaLink />,
}: SocialIconProps) {
  const icon = ICONS[platform.toLowerCase()];
  if (!icon) return <>{fallback}</>;
  return <>{icon}</>;
}
