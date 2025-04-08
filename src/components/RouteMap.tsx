import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Assignment {
  id: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  status: "pending" | "in-progress" | "completed";
  estimatedArrival: string;
  description: string;
}

interface RouteMapProps {
  assignments?: Assignment[];
  currentLocation?: {
    lat: number;
    lng: number;
  };
  onAssignmentSelect?: (assignmentId: string) => void;
}

const RouteMap = ({
  assignments = [
    {
      id: "1",
      location: {
        address: "123 Main St, Anytown, USA",
        coordinates: { lat: 40.7128, lng: -74.006 },
      },
      status: "pending",
      estimatedArrival: "10:30 AM",
      description: "Package delivery",
    },
    {
      id: "2",
      location: {
        address: "456 Oak Ave, Somewhere, USA",
        coordinates: { lat: 40.7148, lng: -74.008 },
      },
      status: "in-progress",
      estimatedArrival: "11:15 AM",
      description: "Furniture installation",
    },
    {
      id: "3",
      location: {
        address: "789 Pine Rd, Elsewhere, USA",
        coordinates: { lat: 40.7168, lng: -74.003 },
      },
      status: "completed",
      estimatedArrival: "09:45 AM",
      description: "Document pickup",
    },
  ],
  currentLocation = { lat: 40.7138, lng: -74.005 },
  onAssignmentSelect = (id) => console.log(`Assignment ${id} selected`),
}: RouteMapProps) => {
  const [zoom, setZoom] = useState(12);
  const [showLegend, setShowLegend] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(
    null,
  );

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 8));
  };

  const handleAssignmentClick = (id: string) => {
    setSelectedAssignment(id);
    onAssignmentSelect(id);
  };

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full h-[500px] relative bg-gray-100 rounded-lg overflow-hidden">
      {/* Map container - in a real implementation this would be replaced with a mapping library like Google Maps, Mapbox, or Leaflet */}
      <div className="w-full h-full bg-[#e8eaed] relative">
        {/* Placeholder for actual map */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <p className="text-lg">Map View (Placeholder)</p>
        </div>

        {/* Current location marker */}
        <div
          className="absolute"
          style={{
            left: `${50 + (currentLocation.lng + 74) * 100}px`,
            top: `${250 - (currentLocation.lat - 40.7) * 1000}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
            <Navigation className="h-4 w-4 text-blue-600 z-10" />
          </div>
        </div>

        {/* Assignment markers */}
        {assignments.map((assignment) => (
          <motion.div
            key={assignment.id}
            className="absolute cursor-pointer"
            style={{
              left: `${50 + (assignment.location.coordinates.lng + 74) * 100}px`,
              top: `${250 - (assignment.location.coordinates.lat - 40.7) * 1000}px`,
              transform: "translate(-50%, -50%)",
            }}
            whileHover={{ scale: 1.2 }}
            onClick={() => handleAssignmentClick(assignment.id)}
          >
            <div className="relative">
              <MapPin
                className={`h-6 w-6 ${selectedAssignment === assignment.id ? "text-primary" : "text-gray-700"}`}
                fill={
                  selectedAssignment === assignment.id
                    ? "rgba(147, 51, 234, 0.2)"
                    : "transparent"
                }
              />
              <div
                className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(assignment.status)} rounded-full border-2 border-white`}
              ></div>
            </div>
          </motion.div>
        ))}

        {/* Route lines would be drawn here in a real implementation */}
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-white"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-white"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowLegend(!showLegend)}
          className="bg-white"
        >
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      {showLegend && (
        <Card className="absolute bottom-4 right-4 w-48 shadow-lg">
          <CardContent className="p-3">
            <h4 className="text-sm font-medium mb-2">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="h-3 w-3 text-blue-600" />
                <span className="text-xs">Current Location</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment tooltip */}
      {selectedAssignment && (
        <div className="absolute bottom-4 left-4">
          <Card className="w-64 shadow-lg">
            <CardContent className="p-3">
              {(() => {
                const assignment = assignments.find(
                  (a) => a.id === selectedAssignment,
                );
                if (!assignment) return null;

                return (
                  <>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-medium">
                        {assignment.description}
                      </h4>
                      <Badge
                        variant={
                          assignment.status === "completed"
                            ? "default"
                            : "outline"
                        }
                        className={
                          assignment.status === "in-progress"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : ""
                        }
                      >
                        {assignment.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {assignment.location.address}
                    </p>
                    <div className="flex items-center gap-1">
                      <Info className="h-3 w-3 text-gray-400" />
                      <p className="text-xs">
                        ETA: {assignment.estimatedArrival}
                      </p>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tooltip for markers */}
      <TooltipProvider>
        {assignments.map((assignment) => (
          <Tooltip key={`tooltip-${assignment.id}`}>
            <TooltipTrigger asChild>
              <div
                className="absolute w-6 h-6"
                style={{
                  left: `${50 + (assignment.location.coordinates.lng + 74) * 100}px`,
                  top: `${250 - (assignment.location.coordinates.lat - 40.7) * 1000}px`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                }}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">{assignment.description}</p>
              <p className="text-xs">ETA: {assignment.estimatedArrival}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default RouteMap;
