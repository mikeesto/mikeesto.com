import { Play, Heart, Smile, Headphones } from "lucide-react";

const IconComponent = ({ iconName }) => {
  const icons = {
    Play,
    Headphones,
    Heart,
    Smile,
  };

  const Icon = icons[iconName];

  return Icon ? (
    <Icon className="w-12 h-12 mb-4 relative z-10 transform transition-transform duration-300 group-hover:scale-110" />
  ) : null;
};

export default IconComponent;
