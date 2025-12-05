import {
  FaCircle,
  FaEarthAfrica,
  FaEarthAmericas,
  FaEarthAsia,
  FaEarthEurope,
  FaEarthOceania,
} from "react-icons/fa6";

export const regionIcons: Record<string, React.ReactNode> = {
  Africa: <FaEarthAfrica className="text-2xl mr-3" />,
  Europe: <FaEarthEurope className="text-2xl mr-3" />,
  Asia: <FaEarthAsia className="text-2xl mr-3" />,
  Americas: <FaEarthAmericas className="text-2xl mr-3" />,
  Oceania: <FaEarthOceania className="text-2xl mr-3" />,
};

export const defaultRegionIcon = <FaCircle className="text-2xl mr-3" />;