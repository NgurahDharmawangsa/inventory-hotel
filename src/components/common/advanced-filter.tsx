"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig = {
  key: string;
  label: string;
  options: FilterOption[];
};

type AdvancedFilterProps = {
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  onSearch: (query: string) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  onClear?: () => void;
};

export function AdvancedFilter({
  searchPlaceholder = "Search...",
  filters = [],
  onSearch,
  onFilterChange,
  onClear,
}: AdvancedFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value === "all" || !value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setActiveFilters({});
    onSearch("");
    onFilterChange({});
    if (onClear) onClear();
  };

  const activeFilterCount = Object.keys(activeFilters).length;
  const hasActiveFilters = searchQuery || activeFilterCount > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        {filters.length > 0 && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold bg-[#c9a342] text-[#0a0d14] rounded">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Filter Options</h4>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="h-auto py-1 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {filters.map((filter) => (
                  <div key={filter.key} className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {filter.label}
                    </label>
                    <Select
                      value={activeFilters[filter.key] || "all"}
                      onValueChange={(value) => handleFilterChange(filter.key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {filter.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="shrink-0"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find((f) => f.key === key);
            if (!filter) return null;
            const option = filter.options.find((o) => o.value === value);
            if (!option) return null;

            return (
              <div
                key={key}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs font-medium"
              >
                <span className="text-muted-foreground">{filter.label}:</span>
                <span className="text-foreground">{option.label}</span>
                <button
                  onClick={() => handleFilterChange(key, "")}
                  className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}