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
              "w-full border border-gray-300 rounded-lg p-2 text-left flex items-center justify-between",
              leftIcon && "pl-10",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <span>
              {selectedStation
                ? selectedStation.name
                : `Select your ${label.toLowerCase()}`}
            </span>
            <span className="ml-auto opacity-50">▼</span>
          </button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-full">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No match found.</CommandEmpty>
              {options.map((station) => (
                <CommandItem
                  key={station.id}
                  value={station.name}
                  onSelect={() => {
                    onChange(station.id.toString());
                    setOpen(false);
                  }}
                >
                  {station.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <span className="absolute left-3 top-7 flex justify-center items-center pointer-events-none">
        {leftIcon}
      </span>
    </div>
  );
}
