import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface Subcategory {
  id: string;
  title: string;
  description: string;
}

interface SubcategoryListProps {
  categoryId?: string;
  categoryTitle?: string;
  subcategories?: Subcategory[];
  onBackClick?: () => void;
  onSubcategoryClick?: (subcategory: Subcategory) => void;
}

const SubcategoryList = ({
  categoryId = "",
  categoryTitle = "Category",
  subcategories = [],
  onBackClick = () => {},
  onSubcategoryClick = () => {},
}: SubcategoryListProps) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          className="mb-4 flex items-center text-primary"
          onClick={onBackClick}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>

        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          {categoryTitle} Subcategories
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Select a specific issue type to file your complaint
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subcategories.map((subcategory, index) => (
          <motion.div
            key={subcategory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className="h-full cursor-pointer hover:shadow-md transition-shadow duration-300 bg-white"
              onClick={() => onSubcategoryClick(subcategory)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{subcategory.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {subcategory.description}
                </CardDescription>
                <div className="flex items-center text-primary text-sm font-medium">
                  <span>File a complaint</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryList;
