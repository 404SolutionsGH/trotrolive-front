/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface RoleUpgradeState {
  selectedRole: string;
  uploadedFiles: { [key: string]: File | string | null };
  isSubmitted: boolean;
  isVerified: boolean;
  submissionId?: string;
  lastCheckTime?: number;
  intervalCheck: number;
  
  // Actions
  setSelectedRole: (role: string) => void;
  setUploadedFiles: (files: { [key: string]: File | string | null }) => void;
  setSubmitted: (submitted: boolean, submissionId?: string) => void;
  setVerified: (verified: boolean) => void;
  setLastCheckTime: (time: number) => void;
  setIntervalCheck: (interval: number) => void;
  resetForm: () => void;
  
  // File blob storage in cookies
  storeFileBlob: (fieldName: string, file: File) => void;
  getFileBlob: (fieldName: string) => File | null;
  clearFileBlob: (fieldName: string) => void;
}

export const useRoleUpgradeStore = create<RoleUpgradeState>()(
  persist(
    (set, get) => ({
      selectedRole: "",
      uploadedFiles: {},
      isSubmitted: false,
      isVerified: false,
      submissionId: undefined,
      lastCheckTime: undefined,
      intervalCheck: 40, // 40 seconds default

      setSelectedRole: (role) => set({ selectedRole: role }),
      setUploadedFiles: (files) => set({ uploadedFiles: files }),
      setSubmitted: (submitted, submissionId) => set({ 
        isSubmitted: submitted, 
        submissionId: submissionId,
        lastCheckTime: submitted ? Date.now() : undefined
      }),
      setVerified: (verified) => set({ isVerified: verified }),
      setLastCheckTime: (time) => set({ lastCheckTime: time }),
      setIntervalCheck: (interval) => set({ intervalCheck: interval }),
      
      resetForm: () => set({ 
        selectedRole: "",
        uploadedFiles: {},
        isSubmitted: false,
        isVerified: false,
        submissionId: undefined,
        lastCheckTime: undefined
      }),

      // File blob storage in cookies
      storeFileBlob: (fieldName: string, file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          Cookies.set(`role_upgrade_${fieldName}`, base64, { 
            expires: 7, 
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        };
        reader.readAsDataURL(file);
      },

      getFileBlob: (fieldName: string) => {
        const base64 = Cookies.get(`role_upgrade_${fieldName}`);
        if (base64) {
          try {
            // Convert base64 back to file
            const byteString = atob(base64.split(',')[1]);
            const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            return new File([ab], `${fieldName}.${mimeString.split('/')[1]}`, { type: mimeString });
          } catch (error) {
            console.error('Error converting base64 to file:', error);
            return null;
          }
        }
        return null;
      },

      clearFileBlob: (fieldName: string) => {
        Cookies.remove(`role_upgrade_${fieldName}`, { path: '/' });
      },
    }),
    {
      name: 'role-upgrade-storage',
      partialize: (state) => ({ 
        selectedRole: state.selectedRole,
        uploadedFiles: state.uploadedFiles,
        isSubmitted: state.isSubmitted,
        isVerified: state.isVerified,
        submissionId: state.submissionId,
        lastCheckTime: state.lastCheckTime,
        intervalCheck: state.intervalCheck
      }),
    }
  )
); 