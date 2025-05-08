import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CheckCircle, Clock, Eye, FileText, XCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

interface ComplaintTrackerProps {
  userRegistrationNumber: string;
  onBackClick: () => void;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  category: {
    title: string;
  };
  subcategory: {
    title: string;
  };
  incident_date: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  seen: <Eye className="h-5 w-5 text-blue-500" />,
  "in progress": <FileText className="h-5 w-5 text-orange-500" />,
  resolved: <CheckCircle className="h-5 w-5 text-green-500" />,
  rejected: <XCircle className="h-5 w-5 text-red-500" />,
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  seen: "bg-blue-100 text-blue-800",
  "in progress": "bg-orange-100 text-orange-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const ComplaintTracker = ({
  userRegistrationNumber,
  onBackClick,
}: ComplaintTrackerProps) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, [userRegistrationNumber]);

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
          category:category_id(title),
          subcategory:subcategory_id(title)
        `,
        )
        .eq("user_id", "00000000-0000-0000-0000-000000000000")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast({
        title: "Error",
        description: "Failed to load your complaints. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 py-8 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          className="mb-4 flex items-center text-primary"
          onClick={onBackClick}
        >
          ← Back to Home
        </Button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            My Complaints
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Track the status of all your submitted complaints
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow-sm">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Complaints Found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't submitted any complaints yet.
            </p>
            <Button onClick={onBackClick}>Submit a Complaint</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="bg-white">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{complaint.title}</CardTitle>
                    <Badge
                      className={`${statusColors[complaint.status]} flex items-center gap-1`}
                    >
                      {statusIcons[complaint.status]}
                      <span className="capitalize">{complaint.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>
                    Submitted on {format(new Date(complaint.created_at), "PPP")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Category
                      </h4>
                      <p>{complaint.category.title}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Subcategory
                      </h4>
                      <p>{complaint.subcategory.title}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Incident Date
                      </h4>
                      <p>{format(new Date(complaint.incident_date), "PPP")}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Last Updated
                      </h4>
                      <p>{format(new Date(complaint.updated_at), "PPP")}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Description
                    </h4>
                    <p className="text-gray-700 whitespace-pre-line">
                      {complaint.description}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="text-sm text-gray-500">
                    Complaint ID: {complaint.id.substring(0, 8)}
                  </div>
                  {complaint.status === "resolved" && (
                    <Badge className="bg-green-100 text-green-800">
                      Resolved on{" "}
                      {format(new Date(complaint.updated_at), "PPP")}
                    </Badge>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ComplaintTracker;
