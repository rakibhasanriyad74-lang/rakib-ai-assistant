import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { RightPanel } from './RightPanel';

export function AppShell() {
  return (
    <div className="flex w-full h-full bg-background">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <MainContent />

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
}
