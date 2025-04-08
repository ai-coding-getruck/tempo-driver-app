import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, CheckCircle, Image, Loader2, Upload, X } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

// Define the form schema with Zod
const taskFormSchema = z.object({
  notes: z
    .string()
    .min(5, { message: "Notes must be at least 5 characters" })
    .max(500),
  completionStatus: z.enum(["completed", "incomplete", "partial"]),
  customerSignature: z.boolean().default(false),
  deliveryConfirmation: z
    .string()
    .min(3, { message: "Confirmation code is required" })
    .optional(),
  additionalDetails: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  taskId?: string;
  initialData?: TaskFormValues;
  onSubmit?: (data: TaskFormValues & { photos: string[] }) => void;
  isOffline?: boolean;
}

const TaskForm = ({
  taskId = "task-1",
  initialData = {
    notes: "",
    completionStatus: "incomplete" as const,
    customerSignature: false,
    deliveryConfirmation: "",
    additionalDetails: "",
  },
  onSubmit = () => {},
  isOffline = false,
}: TaskFormProps) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData,
  });

  const handleSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSubmit({ ...data, photos });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPhoto = () => {
    // In a real app, this would open the camera or file picker
    // For this demo, we'll add a placeholder image
    const newPhoto = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    setPhotos([...photos, newPhoto]);
    setShowCamera(false);
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const simulateCameraCapture = () => {
    setShowCamera(true);
    // In a real app, this would activate the device camera
    // For this demo, we'll simulate a camera interface
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Task Completion Form</CardTitle>
        <CardDescription>
          Fill out the required information to complete this task.
          {isOffline && (
            <Alert className="mt-2 bg-amber-50 border-amber-200">
              <AlertTitle className="text-amber-800 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                Offline Mode
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                Your submission will be saved locally and uploaded when
                connection is restored.
              </AlertDescription>
            </Alert>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter details about the task completion"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide detailed information about how the task was
                    completed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completionStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completion Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="incomplete">Incomplete</SelectItem>
                      <SelectItem value="partial">
                        Partially Completed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerSignature"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Customer Signature
                    </FormLabel>
                    <FormDescription>
                      Confirm if customer signature was collected
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Confirmation Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter confirmation code" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the code provided by the customer or system
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Photo Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Add photos to document the completed task
                </p>
              </div>

              {showCamera ? (
                <div className="relative w-full h-[300px] bg-slate-900 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
                        <Camera size={32} className="text-white" />
                      </div>
                    </div>
                    <p>Camera Simulation</p>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCamera(false)}
                      className="bg-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddPhoto}
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      Capture
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative rounded-md overflow-hidden h-[120px] bg-slate-100"
                    >
                      <img
                        src={photo}
                        alt={`Task photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full"
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center h-[120px] border-2 border-dashed rounded-md cursor-pointer bg-slate-50 hover:bg-slate-100"
                    onClick={simulateCameraCapture}
                  >
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Camera size={24} />
                      <span className="text-sm">Add Photo</span>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any other relevant information"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-6 flex justify-between">
              <Button variant="outline" type="button">
                Save Draft
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Task
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
