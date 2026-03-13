import {
  FaCircle,
  FaEarthAfrica,
  FaEarthAmericas,
  FaEarthAsia,
  FaEarthEurope,
  FaEarthOceania,
} from "react-icons/fa6";

export const regionIcons: Record<string, React.ReactNode> = {
  Africa: <FaEarthAfrica className="text-2xl ml-1 mr-1" />,
  Europe: <FaEarthEurope className="text-2xl ml-1 mr-1" />,
  Asia: <FaEarthAsia className="text-2xl ml-1 mr-1" />,
  Americas: <FaEarthAmericas className="text-2xl mr-2" />,
  Oceania: <FaEarthOceania className="text-2xl ml-1 mr-1" />,
};

export const defaultRegionIcon = <FaCircle className="text-2xl ml-1 mr-1" />;
