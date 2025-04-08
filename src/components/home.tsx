import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, LogOut, Menu } from "lucide-react";
import RouteMap from "./RouteMap";
import AssignmentList from "./AssignmentList";

interface HomeProps {
  driverName?: string;
  driverAvatar?: string;
  routeId?: string;
  assignmentCount?: number;
  completedCount?: number;
}

const Home = ({
  driverName = "John Doe",
  driverAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=driver123",
  routeId = "RT-12345",
  assignmentCount = 8,
  completedCount = 2,
}: HomeProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("map");

  // Mock data for assignments
  const assignments = [
    {
      id: "1",
      location: "123 Main St, Anytown, USA",
      timeWindow: "9:00 AM - 11:00 AM",
      status: "completed",
      description: "Package delivery to front door",
    },
    {
      id: "2",
      location: "456 Oak Ave, Somewhere, USA",
      timeWindow: "11:30 AM - 1:30 PM",
      status: "completed",
      description: "Signature required for delivery",
    },
    {
      id: "3",
      location: "789 Pine Rd, Elsewhere, USA",
      timeWindow: "2:00 PM - 4:00 PM",
      status: "in-progress",
      description: "Deliver to back entrance",
    },
    {
      id: "4",
      location: "101 Maple Dr, Nowhere, USA",
      timeWindow: "4:30 PM - 6:30 PM",
      status: "pending",
      description: "Call customer before arrival",
    },
    {
      id: "5",
      location: "202 Cedar Ln, Anyplace, USA",
      timeWindow: "9:00 AM - 11:00 AM",
      status: "pending",
      description: "Leave package with doorman",
    },
    {
      id: "6",
      location: "303 Birch Blvd, Somewhere, USA",
      timeWindow: "11:30 AM - 1:30 PM",
      status: "pending",
      description: "Deliver to mailroom",
    },
    {
      id: "7",
      location: "404 Elm St, Elsewhere, USA",
      timeWindow: "2:00 PM - 4:00 PM",
      status: "pending",
      description: "Signature required",
    },
    {
      id: "8",
      location: "505 Walnut Ave, Nowhere, USA",
      timeWindow: "4:30 PM - 6:30 PM",
      status: "pending",
      description: "Leave at front door if no answer",
    },
  ];

  // Mock route data for map
  const routeData = {
    startLocation: { lat: 40.7128, lng: -74.006 },
    endLocation: { lat: 40.7645, lng: -73.9779 },
    waypoints: assignments.map((assignment, index) => ({
      id: assignment.id,
      location: { lat: 40.7128 + index * 0.01, lng: -74.006 + index * 0.01 },
      status: assignment.status,
    })),
  };

  const handleAssignmentClick = (assignmentId: string) => {
    // Navigate to task details page
    console.log(`Navigate to task details for assignment ${assignmentId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={driverAvatar} alt={driverName} />
                <AvatarFallback>
                  {driverName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <h3 className="font-medium">{driverName}</h3>
                <p className="text-sm text-muted-foreground">Driver</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Route: {routeId}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date().toLocaleDateString()}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {completedCount}/{assignmentCount} completed
              </Badge>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-card p-4">
          <div className="flex flex-col gap-2">
            <p className="font-medium">{driverName}</p>
            <Badge variant="outline" className="flex items-center gap-1 w-fit">
              <MapPin className="h-3 w-3" />
              Route: {routeId}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 w-fit">
              <Calendar className="h-3 w-3" />
              {new Date().toLocaleDateString()}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 w-fit">
              <Clock className="h-3 w-3" />
              {completedCount}/{assignmentCount} completed
            </Badge>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex justify-between items-center">
              <span>Route Overview</span>
              <Tabs
                value={activeView}
                onValueChange={setActiveView}
                className="md:hidden"
              >
                <TabsList>
                  <TabsTrigger value="map">Map</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="md:hidden">
              {activeView === "map" ? (
                <RouteMap
                  routeData={routeData}
                  onMarkerClick={handleAssignmentClick}
                />
              ) : (
                <AssignmentList
                  assignments={assignments}
                  onAssignmentClick={handleAssignmentClick}
                />
              )}
            </div>
            <div className="hidden md:block">
              <RouteMap
                routeData={routeData}
                onMarkerClick={handleAssignmentClick}
              />
            </div>
          </CardContent>
        </Card>

        <div className="hidden md:block">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <AssignmentList
                assignments={assignments}
                onAssignmentClick={handleAssignmentClick}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;
