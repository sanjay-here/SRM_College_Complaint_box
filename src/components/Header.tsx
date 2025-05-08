import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FileText, LogIn, LogOut, Menu, User } from "lucide-react";

interface HeaderProps {
  onLoginClick?: () => void;
  onLogout?: () => void;
  onViewComplaints?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  userRole?: "student" | "admin";
}

const Header = ({
  onLoginClick = () => {},
  onLogout = () => {},
  onViewComplaints = () => {},
  isLoggedIn = false,
  userName = "Guest User",
  userRole = "student",
}: HeaderProps) => {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div className="flex items-center gap-2">
            <img
              src="/src/images/SRM_logo.jpg"
              alt="SRM Logo"
              className="h-20 w-30"
            />
            <div>
              <h1 className="text-xl font-bold text-primary">
                SRM Complaint Box
              </h1>
              <p className="text-xs text-gray-500">Student Grievance Portal</p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          {/* Mobile menu for smaller screens */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem className="font-medium">
                      <User className="mr-2 h-4 w-4" />
                      {userName}
                      {userRole === "admin" && (
                        <span className="ml-1 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onViewComplaints}>
                      <FileText className="mr-2 h-4 w-4" />
                      {userRole === "admin"
                        ? "Admin Dashboard"
                        : "My Complaints"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={onLoginClick}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login as Student
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLoginClick}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login as Admin
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-medium">{userName}</span>
                  {userRole === "admin" && (
                    <span className="ml-1 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={onViewComplaints}
                >
                  <FileText className="h-4 w-4" />
                  {userRole === "admin" ? "Admin Dashboard" : "My Complaints"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={onLoginClick}
                >
                  <LogIn className="h-4 w-4" />
                  Login as Student
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2"
                  onClick={onLoginClick}
                >
                  <LogIn className="h-4 w-4" />
                  Login as Admin
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
