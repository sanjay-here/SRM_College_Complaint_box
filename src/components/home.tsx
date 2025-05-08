import { useState, useEffect } from "react";
import Header from "./Header";
import FloatingImages from "./FloatingImages";
import CategoryGrid from "./CategoryGrid";
import SubcategoryList from "./SubcategoryList";
import ComplaintForm from "./ComplaintForm";
import ComplaintTracker from "./ComplaintTracker";
import AdminDashboard from "./AdminDashboard";
import LoginDialog from "./LoginDialog";
import Footer from "./Footer";
import { supabase } from "@/lib/supabase";
import { toast } from "./ui/use-toast";

interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Subcategory {
  id: string;
  title: string;
  description: string;
  category_id: string;
}

interface UserData {
  userName: string;
  userRole: "student" | "admin";
  registrationNumber?: string;
}

function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    userName: "Guest User",
    userRole: "student",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showComplaintTracker, setShowComplaintTracker] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default categories in case the database fetch fails
  const defaultCategories: Category[] = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      title: "Academic Issues",
      description: "Issues related to courses, exams, faculty, and teaching",
      icon: "academic",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      title: "Campus Facilities",
      description: "Problems with infrastructure, library, hostel, and canteen",
      icon: "facilities",
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      title: "Transportation & Security",
      description: "Issues with buses, bouncers, parking, and campus security",
      icon: "transportation",
    },
    {
      id: "44444444-4444-4444-4444-444444444444",
      title: "Administrative & Services",
      description:
        "Problems with fees, scholarships, transport passes, and lost items",
      icon: "building",
    },
    {
      id: "55555555-5555-5555-5555-555555555555",
      title: "Technical & Online Services",
      description: "Issues with Wi-Fi, internet, and student portal",
      icon: "wifi",
    },
    {
      id: "66666666-6666-6666-6666-666666666666",
      title: "Extracurricular & General Concerns",
      description: "Problems with clubs, sports, and event management",
      icon: "lightbulb",
    },
  ];

  useEffect(() => {
    fetchCategories();
    checkLoggedInStatus();
  }, []);

  const checkLoggedInStatus = () => {
    // Check if we have user data in localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setIsLoggedIn(true);
        setUserData(parsedUserData);

        // If admin, show admin dashboard
        if (parsedUserData.userRole === "admin") {
          setShowAdminDashboard(true);
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("userData");
      }
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("title");

      if (error) throw error;
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        // Use default categories if no data is returned
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Use default categories on error
      setCategories(defaultCategories);
      toast({
        title: "Error",
        description:
          "Failed to load categories from database. Using default categories.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", categoryId)
        .order("title");

      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast({
        title: "Error",
        description: "Failed to load subcategories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleLogin = async (data: {
    registrationNumber?: string;
    email?: string;
    password: string;
    userType: "student" | "admin";
  }) => {
    try {
      if (data.userType === "student" && data.registrationNumber) {
        // For students, use registration number to login from students table
        const { data: userData, error } = await supabase
          .from("students")
          .select("*")
          .eq("registration_number", data.registrationNumber)
          .eq("password", data.password)
          .single();

        if (error || !userData) {
          toast({
            title: "Login Failed",
            description: "Invalid registration number or password",
            variant: "destructive",
          });
          throw new Error("Invalid credentials");
        }

        const userDataToStore = {
          userName: userData.full_name,
          userRole: userData.role as "student",
          registrationNumber: userData.registration_number,
        };

        setIsLoggedIn(true);
        setUserData(userDataToStore);
        setIsLoginOpen(false);

        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(userDataToStore));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.full_name}!`,
        });
      } else if (data.userType === "admin" && data.email) {
        // For admins, use email to login from users table
        const { data: userData, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", data.email)
          .eq("role", "admin")
          .single();

        console.log("Admin login attempt:", {
          userData,
          error,
          password: data.password,
        });

        if (error || !userData) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
          throw new Error("Invalid credentials");
        }

        // Check password separately
        if (userData.password !== data.password) {
          toast({
            title: "Login Failed",
            description: "Invalid password",
            variant: "destructive",
          });
          throw new Error("Invalid password");
        }

        const userDataToStore = {
          userName: userData.full_name,
          userRole: userData.role as "admin",
        };

        setIsLoggedIn(true);
        setUserData(userDataToStore);
        setIsLoginOpen(false);
        setShowAdminDashboard(true);

        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(userDataToStore));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.full_name}!`,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData({
      userName: "Guest User",
      userRole: "student",
    });
    setShowAdminDashboard(false);
    setShowComplaintTracker(false);
    setShowComplaintForm(false);
    setShowSubcategories(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);

    // Remove user data from localStorage
    localStorage.removeItem("userData");

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    fetchSubcategories(category.id);
    setShowSubcategories(true);
    setShowComplaintForm(false);
    setShowComplaintTracker(false);
  };

  const handleBackClick = () => {
    if (showComplaintForm) {
      setShowComplaintForm(false);
      setShowSubcategories(true);
    } else if (showSubcategories) {
      setShowSubcategories(false);
      setSelectedCategory(null);
    } else if (showComplaintTracker) {
      setShowComplaintTracker(false);
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    // If user is not logged in, show login dialog
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      toast({
        title: "Authentication Required",
        description: "Please log in to file a complaint.",
      });
      return;
    }

    // If user is admin, don't allow filing complaints
    if (userData.userRole === "admin") {
      toast({
        title: "Admin Account",
        description:
          "Administrators cannot file complaints. Please use a student account.",
        variant: "destructive",
      });
      return;
    }

    // Set selected subcategory and show complaint form
    setSelectedSubcategory(subcategory);
    setShowComplaintForm(true);
    setShowSubcategories(false);
  };

  const handleComplaintSubmitted = () => {
    // Return to category selection after complaint is submitted
    setShowComplaintForm(false);
    setSelectedSubcategory(null);
    setShowSubcategories(false);
    setSelectedCategory(null);

    toast({
      title: "Complaint Submitted",
      description:
        "Your complaint has been successfully submitted and will be reviewed by the administration.",
    });
  };

  const handleViewComplaints = () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      toast({
        title: "Authentication Required",
        description: "Please log in to view your complaints.",
      });
      return;
    }

    if (userData.userRole === "admin") {
      setShowAdminDashboard(true);
    } else {
      setShowComplaintTracker(true);
      setShowSubcategories(false);
      setSelectedCategory(null);
      setShowComplaintForm(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <Header
        onLoginClick={handleLoginClick}
        isLoggedIn={isLoggedIn}
        userName={userData.userName}
        userRole={userData.userRole}
        onLogout={handleLogout}
        onViewComplaints={handleViewComplaints}
      />

      <div className="pt-20 flex-grow">
        {/* Admin Dashboard */}
        {showAdminDashboard && isLoggedIn && userData.userRole === "admin" ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <>
            {/* Student Complaint Tracker */}
            {showComplaintTracker &&
            isLoggedIn &&
            userData.userRole === "student" ? (
              <ComplaintTracker
                userRegistrationNumber={userData.registrationNumber || ""}
                onBackClick={handleBackClick}
              />
            ) : (
              <>
                {/* Complaint Form */}
                {showComplaintForm &&
                selectedCategory &&
                selectedSubcategory ? (
                  <ComplaintForm
                    categoryId={selectedCategory.id}
                    categoryTitle={selectedCategory.title}
                    subcategoryId={selectedSubcategory.id}
                    subcategoryTitle={selectedSubcategory.title}
                    userRegistrationNumber={userData.registrationNumber || ""}
                    onComplaintSubmitted={handleComplaintSubmitted}
                    onBackClick={handleBackClick}
                  />
                ) : (
                  <>
                    {/* Only show floating images on the main page */}
                    {!showSubcategories && <FloatingImages />}

                    {/* Subcategory List */}
                    {showSubcategories && selectedCategory ? (
                      <SubcategoryList
                        categoryId={selectedCategory.id}
                        categoryTitle={selectedCategory.title}
                        subcategories={subcategories}
                        onBackClick={handleBackClick}
                        onSubcategoryClick={handleSubcategoryClick}
                      />
                    ) : (
                      /* Category Grid */
                      <CategoryGrid
                        categories={categories.map((cat) => ({
                          id: cat.id,
                          title: cat.title,
                          description: cat.description,
                          icon: cat.icon,
                        }))}
                        onCategoryClick={handleCategoryClick}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      <LoginDialog
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onLogin={handleLogin}
      />
      <Footer />
    </div>
  );
}

export default Home;
