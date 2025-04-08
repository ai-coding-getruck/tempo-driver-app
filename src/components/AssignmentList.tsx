import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Assignment {
  id: string;
  location: string;
  address: string;
  timeWindow: string;
  status: "pending" | "in-progress" | "completed";
  description: string;
}

interface AssignmentListProps {
  assignments?: Assignment[];
  onAssignmentSelect?: (assignment: Assignment) => void;
}

const AssignmentList = ({
  assignments = [
    {
      id: "1",
      location: "Downtown Office",
      address: "123 Main St, City",
      timeWindow: "9:00 AM - 10:30 AM",
      status: "completed",
      description: "Package delivery to reception desk",
    },
    {
      id: "2",
      location: "Westside Apartments",
      address: "456 West Ave, City",
      timeWindow: "11:00 AM - 12:30 PM",
      status: "in-progress",
      description: "Furniture assembly and installation",
    },
    {
      id: "3",
      location: "North Shopping Mall",
      address: "789 North Blvd, City",
      timeWindow: "1:00 PM - 2:30 PM",
      status: "pending",
      description: "Store inventory restocking",
    },
    {
      id: "4",
      location: "Eastside Medical Center",
      address: "321 East Dr, City",
      timeWindow: "3:00 PM - 4:30 PM",
      status: "pending",
      description: "Medical supplies delivery",
    },
    {
      id: "5",
      location: "Southside Restaurant",
      address: "654 South St, City",
      timeWindow: "5:00 PM - 6:30 PM",
      status: "pending",
      description: "Food delivery and setup",
    },
  ],
  onAssignmentSelect = () => {},
}: AssignmentListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter assignments based on search query and status filter
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter
      ? assignment.status === statusFilter
      : true;
    return matchesSearch && matchesStatus;
  });

  // Sort assignments based on time window
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.timeWindow.localeCompare(b.timeWindow);
    } else {
      return b.timeWindow.localeCompare(a.timeWindow);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-white p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Assignments</h2>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortOrder === "asc" ? "Earliest" : "Latest"}
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assignments..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-2 px-2">
        <span>Location</span>
        <span>Time Window</span>
      </div>

      <Separator className="mb-4" />

      <div className="overflow-y-auto flex-grow">
        {sortedAssignments.length > 0 ? (
          <div className="space-y-3">
            {sortedAssignments.map((assignment) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => onAssignmentSelect(assignment)}
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium">{assignment.location}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {assignment.address}
                        </p>
                        <p className="text-sm mt-2">{assignment.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={getStatusColor(assignment.status)}
                          variant="outline"
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(assignment.status)}
                            {assignment.status.charAt(0).toUpperCase() +
                              assignment.status.slice(1).replace("-", " ")}
                          </span>
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {assignment.timeWindow}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No assignments found</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentList;
