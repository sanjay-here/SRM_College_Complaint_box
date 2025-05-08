import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock, CreditCard } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface LoginDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onLogin?: (data: {
    registrationNumber?: string;
    email?: string;
    password: string;
    userType: "student" | "admin";
  }) => void;
}

const studentSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, "Registration number is required")
    .regex(/^RA[0-9]+$/, "Please enter a valid registration number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const adminSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z.string().min(8, "Admin password must be at least 8 characters"),
});

const LoginDialog = ({
  open = true,
  onOpenChange = () => {},
  onLogin = () => {},
}: LoginDialogProps) => {
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student");

  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      registrationNumber: "",
      password: "",
    },
  });

  const adminForm = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleStudentSubmit = (data: z.infer<typeof studentSchema>) => {
    onLogin({ ...data, userType: "student" });
  };

  const handleAdminSubmit = (data: z.infer<typeof adminSchema>) => {
    onLogin({ ...data, userType: "admin" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            SRM Complaint Box
          </DialogTitle>
          <DialogDescription className="text-center">
            Login to access the complaint management system
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="student"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "student" | "admin")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="admin">Administrator</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Form {...studentForm}>
                <form
                  onSubmit={studentForm.handleSubmit(handleStudentSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={studentForm.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="RA2311008020159"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={studentForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full mt-6">
                    Login as Student
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>Use your SRM registration number and password to login</p>
                <p className="mt-1 text-xs">Example: RA2311008020159</p>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="admin">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Form {...adminForm}>
                <form
                  onSubmit={adminForm.handleSubmit(handleAdminSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={adminForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="admin@srm.edu.in"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={adminForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full mt-6">
                    Login as Administrator
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>
                  Administrative access is restricted to authorized personnel
                  only
                </p>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
