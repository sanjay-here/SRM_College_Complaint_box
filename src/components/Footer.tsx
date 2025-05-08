import React from "react";
import { Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 py-4 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 text-sm font-bold">
          Developed by Sanjay A RA2311008020159, Student at SRM, Department of
          Information Technology
        </p>
        <div className="flex justify-center items-center mt-2">
          <a
            href="https://www.linkedin.com/in/sanjay-a-749a90223/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-bold"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn Profile
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
