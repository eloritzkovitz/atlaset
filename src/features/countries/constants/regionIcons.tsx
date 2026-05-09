import {
  FaCircle,
  FaEarthAfrica,
  FaEarthAmericas,
  FaEarthAsia,
  FaEarthEurope,
  FaEarthOceania,
} from "react-icons/fa6";

export const regionIcons: Record<string, React.ReactNode> = {
  africa: <FaEarthAfrica className="text-2xl ms-1 me-1" />,
  europe: <FaEarthEurope className="text-2xl ms-1 me-1" />,
  asia: <FaEarthAsia className="text-2xl ms-1 me-1" />,
  americas: <FaEarthAmericas className="text-2xl ms-1 me-1" />,
  oceania: <FaEarthOceania className="text-2xl ms-1 me-1" />,
};

export const defaultRegionIcon = <FaCircle className="text-2xl ms-1 me-1" />;
