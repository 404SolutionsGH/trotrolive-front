"use client";

import { useState } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Station {
  id: number | string;
  name: string;
}

interface StationComboBoxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Station[];
  disabled?: boolean;
  id?: string;
  leftIcon?: React.ReactNode;
}

export default function StationComboBox({
  label,
  value,
  onChange,
  options,
  disabled = false,
  id,
  leftIcon,
}: StationComboBoxProps) {
  const [open, setOpen] = useState(false);

  const selectedStation = options.find(
    (station) => station.id.toString() === value,
  );

  return (
    <div className="flex flex-col space-y-1 md:space-y-2 relative">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            disabled={disabled}
            id={id}
            className={cn(
              "w-full border border-gray-300 rounded-lg p-3 text-left flex items-center justify-between bg-white",
              leftIcon && "pl-10",
              disabled && "opacity-50 cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
            )}
          >
            <span className="text-sm">
              {selectedStation
                ? selectedStation.name
                : `Select your ${label.toLowerCase()}`}
            </span>
            <span className="ml-auto opacity-50">▼</span>
          </button>
        </PopoverTrigger>

        <PopoverContent 
          className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-hidden z-[90]"
          side="bottom"
          align="start"
          sideOffset={4}
          avoidCollisions={true}
        >
          <Command>
            <CommandInput 
              placeholder={`Search ${label.toLowerCase()}...`} 
              className="border-0 focus:ring-0"
            />
            <CommandList className="max-h-[250px] overflow-y-auto">
              <CommandEmpty>No match found.</CommandEmpty>
              {options.map((station) => (
                <CommandItem
                  key={station.id}
                  value={station.name}
                  onSelect={() => {
                    onChange(station.id.toString());
                    setOpen(false);
                  }}
                  className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                >
                  {station.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <span className="absolute left-3 top-8 flex justify-center items-center pointer-events-none">
        {leftIcon}
      </span>
    </div>
  );
}
