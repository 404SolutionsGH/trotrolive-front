"use client";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="flex flex-col space-y-1 md:space-y-2 relative">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            id={id}
            className={`flex-1 border border-gray-300 rounded-lg p-2 ${leftIcon ? 'pl-10' : ''}`}
          >
            <SelectValue placeholder={`Select your ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((station) => (
              <SelectItem key={station.id} value={station.id.toString()}>
                {station.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 