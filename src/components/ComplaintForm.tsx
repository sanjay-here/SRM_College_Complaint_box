import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ComplaintFormProps {
  categoryId: string;
  categoryTitle: string;
  subcategoryId: string;
  subcategoryTitle: string;
  userRegistrationNumber: string;
  onComplaintSubmitted: () => void;
  onBackClick: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
];

const complaintSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters").max(100),
  description: z.string().min(20, "Please provide more details").max(1000),
  incidentDate: z.date({
    required_error: "Please select a date",
  }),
  evidence: z
    .instanceof(FileList)
    .refine((files) => files.length === 0 || files.length <= 3, {
      message: "You can upload up to 3 files",
    })
    .refine(
      (files) => {
        if (files.length === 0) return true;
        return Array.from(files).every((file) => file.size <= MAX_FILE_SIZE);
      },
      {
        message: `Each file should be less than 5MB`,
      },
    )
    .refine(
      (files) => {
        if (files.length === 0) return true;
        return Array.from(files).every((file) =>
          ACCEPTED_FILE_TYPES.includes(file.type),
        );
      },
      {
        message: "Only JPEG, PNG, GIF images and PDF documents are accepted",
      },
    )
    .optional(),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

const ComplaintForm = ({
  categoryId,
  categoryTitle,
  subcategoryId,
  subcategoryTitle,
  userRegistrationNumber,
  onComplaintSubmitted,
  onBackClick,
}: ComplaintFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      subject: "",
      description: "",
      incidentDate: new Date(),
    },
  });

  const handleSubmit = async (values: ComplaintFormValues) => {
    try {
      setIsSubmitting(true);
      setUploadProgress(10);

      // 1. Create the complaint record
      const { data: complaintData, error: complaintError } = await supabase
        .from("complaints")
        .insert([
          {
            title: values.subject,
            description: values.description,
            category_id: categoryId,
            subcategory_id: subcategoryId,
            user_id: "00000000-0000-0000-0000-000000000000", // Using a placeholder UUID
            status: "pending",
            incident_date: values.incidentDate.toISOString(),
          },
        ])
        .select();

      if (complaintError) throw complaintError;
      setUploadProgress(50);

      // 2. Upload evidence files if any
      if (values.evidence && values.evidence.length > 0) {
        const complaintId = complaintData[0].id;
        const files = Array.from(values.evidence);

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${complaintId}-${i}.${fileExt}`;
          const filePath = `evidence/${complaintId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("complaints")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Update progress
          setUploadProgress(50 + Math.floor(((i + 1) / files.length) * 50));

          // Link evidence to complaint
          await supabase.from("complaint_evidence").insert([
            {
              complaint_id: complaintId,
              file_path: filePath,
              file_name: file.name,
              file_type: file.type,
            },
          ]);
        }
      }

      setUploadProgress(100);
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been successfully submitted.",
      });

      // Reset form and notify parent
      form.reset();
      onComplaintSubmitted();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-8 bg-gray-50">
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
          ← Back
        </Button>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Submit a Complaint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800">
                Complaint Information
              </h3>
              <p className="text-sm text-blue-600 mt-1">
                Category: <span className="font-semibold">{categoryTitle}</span>
              </p>
              <p className="text-sm text-blue-600">
                Subcategory:{" "}
                <span className="font-semibold">{subcategoryTitle}</span>
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complaint Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., Bus Delay Issue, Wi-Fi Connectivity Problem"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a brief title for your complaint
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complaint Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide detailed information about your complaint..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include all relevant details such as time, location, and
                        people involved
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incidentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Incident</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("2020-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select the date when the incident occurred
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="evidence"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Upload Evidence (Optional)</FormLabel>
                      <FormControl>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/gif,application/pdf"
                            className="cursor-pointer"
                            onChange={(e) => onChange(e.target.files)}
                            {...fieldProps}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload up to 3 files (images or PDFs) related to your
                        complaint. Max 5MB each.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ComplaintForm;
