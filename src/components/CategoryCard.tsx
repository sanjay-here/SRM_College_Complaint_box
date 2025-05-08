import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ArrowRight,
  BookOpen,
  Building,
  Bus,
  Coffee,
  Laptop,
  Lightbulb,
  User,
  Utensils,
  Wifi,
} from "lucide-react";

interface CategoryCardProps {
  title?: string;
  description?: string;
  icon?: string;
  onClick?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  academic: <BookOpen className="h-10 w-10" />,
  facilities: <Building className="h-10 w-10" />,
  transportation: <Bus className="h-10 w-10" />,
  cafeteria: <Utensils className="h-10 w-10" />,
  internet: <Wifi className="h-10 w-10" />,
  wifi: <Wifi className="h-10 w-10" />,
  laboratory: <Laptop className="h-10 w-10" />,
  hostel: <Coffee className="h-10 w-10" />,
  building: <Building className="h-10 w-10" />,
  other: <Lightbulb className="h-10 w-10" />,
  lightbulb: <Lightbulb className="h-10 w-10" />,
  user: <User className="h-10 w-10" />,
};

const CategoryCard = ({
  title = "Academic Issues",
  description = "Issues related to courses, exams, faculty, and teaching",
  icon = "academic",
  onClick = () => {},
}: CategoryCardProps) => {
  const IconComponent = iconMap[icon.toLowerCase()] || iconMap.other;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer w-full"
      onClick={onClick}
    >
      <Card className="w-full max-w-[280px] h-[220px] overflow-hidden transition-all duration-300 hover:shadow-lg bg-white">
        <CardHeader className="pb-2">
          <div className="flex justify-center items-center h-16 text-primary">
            {IconComponent}
          </div>
          <CardTitle className="text-xl text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center mb-4 line-clamp-3">
            {description}
          </CardDescription>
          <div className="flex items-center justify-center text-primary text-sm font-medium">
            <span>File a complaint</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;
