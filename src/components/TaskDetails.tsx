import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface TaskFormProps {
  taskId: string;
  isOffline: boolean;
  onComplete: () => void;
  requirements: Array<{
    id: string;
    name: string;
    completed: boolean;
  }>;
}

// Placeholder TaskForm component since the actual one isn't available
const TaskForm = ({
  taskId,
  isOffline,
  onComplete,
  requirements,
}: TaskFormProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Complete Task Form</h3>
          <p className="text-sm text-muted-foreground">
            Fill out the required information to complete this task.
          </p>

          {requirements.map((req) => (
            <div key={req.id} className="border p-4 rounded-md">
              <h4 className="font-medium mb-2">{req.name}</h4>
              <div className="space-y-4">
                {req.name.includes("Photo") && (
                  <div className="border-2 border-dashed rounded-md p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Button variant="outline" className="mb-2">
                        Take Photo
                      </Button>
                      <span className="text-xs text-muted-foreground">or</span>
                      <Button variant="outline" className="mt-2">
                        Upload Image
                      </Button>
                    </div>
                  </div>
                )}

                {req.name.includes("signature") && (
                  <div className="border-2 border-dashed rounded-md p-8 text-center">
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Signature area
                      </p>
                      <Button variant="outline">Capture Signature</Button>
                    </div>
                  </div>
                )}

                {req.name.includes("confirmation") && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Delivery Notes
                    </label>
                    <textarea
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      placeholder="Enter any notes about the delivery..."
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onComplete} className="w-full">
          Submit Form
        </Button>
      </CardFooter>
    </Card>
  );
};

interface TaskDetailsProps {
  taskId?: string;
  onBack?: () => void;
}

const TaskDetails = ({ taskId = "1", onBack = () => {} }: TaskDetailsProps) => {
  const [networkStatus, setNetworkStatus] = useState<"online" | "offline">(
    "online",
  );
  const [taskStatus, setTaskStatus] = useState<
    "pending" | "in-progress" | "completed"
  >("pending");

  // Mock task data
  const task = {
    id: taskId,
    title: "Package Delivery",
    description: "Deliver package to customer and collect signature",
    status: taskStatus,
    timeWindow: {
      start: "10:00 AM",
      end: "12:00 PM",
    },
    location: {
      address: "123 Main Street, Anytown, USA",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    customer: {
      name: "John Smith",
      phone: "(555) 123-4567",
      notes: "Leave package at front door if no answer",
    },
    requirements: [
      { id: "1", name: "Delivery confirmation", completed: false },
      { id: "2", name: "Photo of delivered package", completed: false },
      { id: "3", name: "Customer signature", completed: false },
    ],
  };

  const handleStartTask = () => {
    setTaskStatus("in-progress");
  };

  const handleCompleteTask = () => {
    setTaskStatus("completed");
  };

  const toggleNetworkStatus = () => {
    setNetworkStatus(networkStatus === "online" ? "offline" : "online");
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "in-progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-background">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Task Details</h1>
        <div className="ml-auto flex items-center gap-2">
          {getStatusBadge()}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleNetworkStatus}
            className="ml-2"
          >
            {networkStatus === "online" ? (
              <Wifi className="h-4 w-4 mr-2" />
            ) : (
              <WifiOff className="h-4 w-4 mr-2" />
            )}
            {networkStatus === "online" ? "Online" : "Offline"}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
          <CardDescription>{task.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Time Window</h3>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {task.timeWindow.start} - {task.timeWindow.end}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Location</h3>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{task.location.address}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-sm font-medium mb-2">Customer Information</h3>
            <div className="flex items-center text-sm mb-2">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{task.customer.name}</span>
            </div>
            <div className="flex items-center text-sm mb-2">
              <span className="ml-6">{task.customer.phone}</span>
            </div>
            <div className="flex items-start text-sm">
              <span className="ml-6 text-muted-foreground">
                Notes: {task.customer.notes}
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-sm font-medium mb-2">Requirements</h3>
            <ul className="space-y-2">
              {task.requirements.map((req) => (
                <li key={req.id} className="flex items-center text-sm">
                  {req.completed ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 mr-2 rounded-full border border-muted-foreground" />
                  )}
                  <span>{req.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {networkStatus === "offline" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Offline Mode</AlertTitle>
          <AlertDescription>
            You are currently working offline. Your changes will be saved
            locally and synchronized when you reconnect.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="details" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="form">Task Form</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="prose max-w-none">
                <h3>Task Instructions</h3>
                <p>Follow these steps to complete the delivery:</p>
                <ol>
                  <li>Verify the package is in good condition</li>
                  <li>Deliver to the address specified</li>
                  <li>
                    Obtain customer signature or take photo of delivery location
                  </li>
                  <li>Mark task as complete in the app</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {task.status === "pending" && (
                <Button onClick={handleStartTask}>Start Task</Button>
              )}
              {task.status === "in-progress" && (
                <Button onClick={handleCompleteTask}>Complete Task</Button>
              )}
              {task.status === "completed" && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Task Completed</span>
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="form" className="mt-4">
          <TaskForm
            taskId={task.id}
            isOffline={networkStatus === "offline"}
            onComplete={handleCompleteTask}
            requirements={task.requirements}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDetails;
