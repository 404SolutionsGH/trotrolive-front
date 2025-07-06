/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, X, FileText, ImageIcon, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface FileUploadCardProps {
  fieldName: string;
  label: string;
  accept?: string;
  value: File | string | null;
  onChange: (file: File | null) => void;
  onRemove: () => void;
  disabled?: boolean;
  isVerified?: boolean;
  roleType?: string;
}

export function FileUploadCard({
  fieldName,
  label,
  accept = "image/*,.pdf,.doc,.docx",
  value,
  onChange,
  onRemove,
  disabled = false,
  isVerified = false,
  roleType
}: FileUploadCardProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove();
  };

  const getFileIcon = () => {
    if (!value) return <Cloud className="w-8 h-8 text-gray-400" />;
    
    if (value instanceof File) {
      if (value.type.startsWith('image/')) {
        return <ImageIcon className="w-8 h-8 text-blue-500" width={32} height={32} />;
      } else {
        return <FileText className="w-8 h-8 text-green-500" />;
      }
    }
    return <FileText className="w-8 h-8 text-gray-400" />;
  };

  const getFileName = () => {
    if (!value) return "No file selected";
    if (value instanceof File) {
      return value.name;
    }
    return "File uploaded";
  };

  const getFileSize = () => {
    if (!value || !(value instanceof File)) return "";
    const sizeInMB = (value.size / (1024 * 1024)).toFixed(2);
    return `${sizeInMB} MB`;
  };

  return (
    <Card className={`relative transition-all duration-200 ${
      disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
    } ${isVerified ? 'border-green-500 bg-green-50' : ''}`}>
      <CardContent className="p-6">
        {/* Verification Badge */}
        {isVerified && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {roleType} Verified
            </Badge>
          </div>
        )}

        {/* Loading State */}
        {disabled && !isVerified && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600 animate-spin" />
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Under Review
            </Badge>
          </div>
        )}

        <div className="space-y-4">
          {/* File Upload Area */}
          <div className="text-center">
            {getFileIcon()}
            <h3 className="mt-2 text-lg font-medium text-gray-900">{label}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {value ? getFileName() : "Click to upload or drag and drop"}
            </p>
            {value && getFileSize() && (
              <p className="text-xs text-gray-400">{getFileSize()}</p>
            )}
          </div>

          {/* File Preview */}
          {preview && (
            <div className="mt-4">
              <Image
                src={preview}
                alt="File preview" 
                className="w-full h-32 object-cover rounded-lg border"
                width={100}
                height={100}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!value ? (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Cloud className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                >
                  <Cloud className="w-4 h-4 mr-2" />
                  Change File
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRemove}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
} 