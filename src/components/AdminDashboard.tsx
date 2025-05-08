import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Filter,
  LogOut,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    title: string;
  };
  subcategory: {
    id: string;
    title: string;
  };
  user: {
    registration_number: string;
    full_name: string;
    department: string;
  };
  incident_date: string;
}

interface Category {
  id: string;
  title: string;
  count?: number;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "seen", label: "Seen" },
  { value: "in progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  seen: "bg-blue-100 text-blue-800",
  "in progress": "bg-orange-100 text-orange-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  seen: <Eye className="h-4 w-4" />,
  "in progress": <RefreshCw className="h-4 w-4" />,
  resolved: <CheckCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
};

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchComplaints();
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(
        complaints.filter((c) => c.category.id === selectedCategory),
      );
    }
  }, [selectedCategory, complaints]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, title")
        .order("title");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("complaints")
        .select(
          `
          id,
          title,
          description,
          status,
          created_at,
          updated_at,
          incident_date,
          category:category_id(id, title),
          subcategory:subcategory_id(id, title),
          user:user_id(id, registration_number, full_name, department)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
      setFilteredComplaints(data || []);

      // Count complaints by category
      if (data) {
        const categoryCounts = data.reduce(
          (acc, complaint) => {
            const categoryId = complaint.category.id;
            acc[categoryId] = (acc[categoryId] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            count: categoryCounts[cat.id] || 0,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast({
        title: "Error",
        description: "Failed to load complaints. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (
    complaintId: string,
    newStatus: string,
  ) => {
    console.log(`Updating complaint ${complaintId} to status: ${newStatus}`);
    try {
      const { error } = await supabase
        .from("complaints")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", complaintId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Complaint status changed to ${newStatus}`,
      });

      // Refresh complaints list
      setRefreshTrigger((prev) => prev + 1);

      // Update the selected complaint if it's the one being updated
      if (selectedComplaint && selectedComplaint.id === complaintId) {
        setSelectedComplaint({
          ...selectedComplaint,
          status: newStatus,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error updating complaint status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update complaint status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const getStatusCounts = () => {
    return complaints.reduce(
      (acc, complaint) => {
        acc[complaint.status] = (acc[complaint.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{complaints.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {statusCounts.pending || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {statusCounts["in progress"] || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {statusCounts.resolved || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {statusCounts.rejected || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium">Filter Complaints</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title} ({category.count || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Tabs defaultValue="list">
            <div className="border-b px-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Complaint List
                </TabsTrigger>
                {selectedComplaint && (
                  <TabsTrigger
                    value="detail"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Complaint Details
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent value="list" className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="text-center p-10">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No Complaints Found
                  </h3>
                  <p className="text-gray-500">
                    There are no complaints in this category.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComplaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">
                            {complaint.id.substring(0, 8)}
                          </TableCell>
                          <TableCell>{complaint.title}</TableCell>
                          <TableCell>
                            {complaint.category.title}
                            <div className="text-xs text-gray-500">
                              {complaint.subcategory.title}
                            </div>
                          </TableCell>
                          <TableCell>
                            {complaint.user.full_name}
                            <div className="text-xs text-gray-500">
                              {complaint.user.department}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(complaint.created_at), "PP")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${statusColors[complaint.status]} flex items-center gap-1`}
                            >
                              {statusIcons[complaint.status]}
                              <span className="capitalize">
                                {complaint.status}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedComplaint(complaint)}
                              >
                                View
                              </Button>
                              <Select
                                value={complaint.status}
                                onValueChange={(value) =>
                                  updateComplaintStatus(complaint.id, value)
                                }
                              >
                                <SelectTrigger className="w-[130px] h-8">
                                  <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      <div className="flex items-center gap-2">
                                        {statusIcons[option.value]}
                                        {option.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {selectedComplaint && (
              <TabsContent value="detail" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">
                              {selectedComplaint.title}
                            </CardTitle>
                            <CardDescription>
                              Submitted on{" "}
                              {format(
                                new Date(selectedComplaint.created_at),
                                "PPP",
                              )}
                            </CardDescription>
                          </div>
                          <Badge
                            className={`${statusColors[selectedComplaint.status]} flex items-center gap-1`}
                          >
                            {statusIcons[selectedComplaint.status]}
                            <span className="capitalize">
                              {selectedComplaint.status}
                            </span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Description
                          </h3>
                          <p className="whitespace-pre-line">
                            {selectedComplaint.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              Category
                            </h3>
                            <p>{selectedComplaint.category.title}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              Subcategory
                            </h3>
                            <p>{selectedComplaint.subcategory.title}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              Incident Date
                            </h3>
                            <p>
                              {format(
                                new Date(selectedComplaint.incident_date),
                                "PPP",
                              )}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              Last Updated
                            </h3>
                            <p>
                              {format(
                                new Date(selectedComplaint.updated_at),
                                "PPP",
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Student Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Name
                          </h3>
                          <p>{selectedComplaint.user.full_name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Registration Number
                          </h3>
                          <p>{selectedComplaint.user.registration_number}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Department
                          </h3>
                          <p>{selectedComplaint.user.department}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-lg">Update Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {statusOptions.map((option) => (
                            <Button
                              key={option.value}
                              variant={
                                selectedComplaint.status === option.value
                                  ? "default"
                                  : "outline"
                              }
                              className="w-full justify-start"
                              onClick={() =>
                                updateComplaintStatus(
                                  selectedComplaint.id,
                                  option.value,
                                )
                              }
                            >
                              <div className="flex items-center gap-2">
                                {statusIcons[option.value]}
                                {option.label}
                              </div>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
