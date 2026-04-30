import {
  FaCircle,
  FaEarthAfrica,
  FaEarthAmericas,
  FaEarthAsia,
  FaEarthEurope,
  FaEarthOceania,
} from "react-icons/fa6";

export const regionIcons: Record<string, React.ReactNode> = {
  Africa: <FaEarthAfrica className="text-2xl ms-1 me-1" />,
  Europe: <FaEarthEurope className="text-2xl ms-1 me-1" />,
  Asia: <FaEarthAsia className="text-2xl ms-1 me-1" />,
  Americas: <FaEarthAmericas className="text-2xl ms-1 me-1" />,
  Oceania: <FaEarthOceania className="text-2xl ms-1 me-1" />,
};

export const defaultRegionIcon = <FaCircle className="text-2xl ms-1 me-1" />;
