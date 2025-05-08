import React from "react";
import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";

interface CategoryGridProps {
  categories?: CategoryItem[];
  onCategoryClick?: (category: CategoryItem) => void;
}

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const defaultCategories: CategoryItem[] = [
  {
    id: "1",
    title: "Academic Issues",
    description: "Issues related to courses, exams, faculty, and teaching",
    icon: "academic",
  },
  {
    id: "2",
    title: "Campus Facilities",
    description: "Problems with infrastructure, library, hostel, and canteen",
    icon: "facilities",
  },
  {
    id: "3",
    title: "Transportation & Security",
    description: "Issues with buses, bouncers, parking, and campus security",
    icon: "transportation",
  },
  {
    id: "4",
    title: "Administrative & Services",
    description:
      "Problems with fees, scholarships, transport passes, and lost items",
    icon: "building",
  },
  {
    id: "5",
    title: "Technical & Online Services",
    description: "Issues with Wi-Fi, internet, and student portal",
    icon: "wifi",
  },
  {
    id: "6",
    title: "Extracurricular & General",
    description: "Problems with clubs, sports, and event management",
    icon: "lightbulb",
  },
  {
    id: "7",
    title: "Ragging & Student Conduct",
    description: "Report ragging incidents, student misbehavior, or fights",
    icon: "user",
  },
];

const CategoryGrid = ({
  categories = defaultCategories,
  onCategoryClick = () => {},
}: CategoryGridProps) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Select a Complaint Category
        </h2>
        <p className="text-center text-gray-600 mb-4 max-w-2xl mx-auto">
          Choose the appropriate category for your complaint to ensure it
          reaches the right department for quick resolution.
        </p>
        <p className="text-center text-gray-600 mb-4 max-w-2xl mx-auto">
          You can file complaints about academic issues, campus facilities,
          transportation, and other concerns. Our team will review and address
          your complaint promptly.
        </p>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
          For serious and emergency issues, please contact the Admin Office
          directly:
          <br />
          Helpline: 044-4743-2350
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: category.id.length > 5 ? 0.1 : parseInt(category.id) * 0.1,
            }}
            className="w-full flex justify-center"
          >
            <CategoryCard
              title={category.title}
              description={category.description}
              icon={category.icon}
              onClick={() => onCategoryClick(category)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
