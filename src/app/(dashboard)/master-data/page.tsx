"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, MapPin, DoorOpen } from "lucide-react";
import { DepartmentsTab } from "@/features/master-data/departments/departments-tab";
import { LocationsTab } from "@/features/master-data/locations/locations-tab";
import { RoomsTab } from "@/features/master-data/rooms/rooms-tab";

export default function MasterDataPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Master Data Management</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Manage organizational structure, location registry, and room inventory database.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Departments</span>
            <span className="sm:hidden">Dept</span>
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Locations</span>
            <span className="sm:hidden">Loc</span>
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <DoorOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Rooms</span>
            <span className="sm:hidden">Room</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <DepartmentsTab />
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <LocationsTab />
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <RoomsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}