"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, MapPin, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LocationRoomOption } from "@/repositories/hardware.repository";

interface LocationRoomFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: LocationRoomOption[];
  allLabel?: string;
  placeholder?: string;
}

export function LocationRoomFilter({
  value,
  onChange,
  options,
  allLabel = "All Locations",
  placeholder = "Select location or room...",
}: LocationRoomFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const locations = options.filter((o) => o.group === "Location");
  const rooms = options.filter((o) => o.group === "Room");

  const filteredLocations = locations.filter((o) =>
    o.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredRooms = rooms.filter((o) =>
    o.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLabel = value === "ALL" ? allLabel : options.find((o) => o.value === value)?.label ?? allLabel;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex h-10 w-48 justify-between rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-xs font-normal"
        >
          <span className={cn("truncate", value === "ALL" && "text-muted-foreground/60")}>
            {selectedLabel}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        {/* Search input */}
        <div className="flex items-center border-b border-border px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Options list */}
        <div className="max-h-60 overflow-y-auto p-1">
          {/* "All Locations" option */}
          <button
            onClick={() => {
              onChange("ALL");
              setOpen(false);
              setSearchQuery("");
            }}
            className={cn(
              "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
              value === "ALL" && "bg-accent text-accent-foreground"
            )}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                value === "ALL" ? "opacity-100" : "opacity-0"
              )}
            />
            {allLabel}
          </button>

          {/* Locations group */}
          {filteredLocations.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-muted-foreground/70">
                <MapPin className="h-3 w-3" />
                Locations
              </div>
              {filteredLocations.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground pl-7",
                    value === option.value && "bg-accent text-accent-foreground"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </button>
              ))}
            </>
          )}

          {/* Rooms group */}
          {filteredRooms.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-muted-foreground/70">
                <DoorOpen className="h-3 w-3" />
                Rooms
              </div>
              {filteredRooms.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground pl-7",
                    value === option.value && "bg-accent text-accent-foreground"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </button>
              ))}
            </>
          )}

          {/* Empty state */}
          {filteredLocations.length === 0 && filteredRooms.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}