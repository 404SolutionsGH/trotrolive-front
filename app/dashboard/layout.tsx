import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <main className="flex-grow py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-3">
          {children}
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
