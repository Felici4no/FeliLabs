import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Home, ChevronRight } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPath: string[];
  onBreadcrumbNavigate: (index: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  currentPath, 
  onBreadcrumbNavigate 
}) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between lg:justify-start gap-4 relative z-50"
    >
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-2 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Logo/Title */}
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-lg text-white">FeliLabs</span>
      </div>

      {/* Breadcrumb Navigation - Hidden on mobile, shown on desktop */}
      <nav className="hidden md:flex items-center gap-2 flex-1 ml-6 overflow-x-auto">
        <button
          onClick={() => onBreadcrumbNavigate(-1)}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <Home size={14} />
          <span className="font-mono text-sm">Lucas Feliciano</span>
        </button>
        
        {currentPath.map((segment, index) => (
          <React.Fragment key={index}>
            <ChevronRight size={14} className="text-gray-600 flex-shrink-0" />
            <button
              onClick={() => onBreadcrumbNavigate(index)}
              className="font-mono text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap"
            >
              {segment}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* Mobile breadcrumb indicator */}
      <div className="md:hidden flex items-center text-gray-400 text-sm font-mono">
        {currentPath.length > 0 ? (
          <span>{currentPath[currentPath.length - 1]}</span>
        ) : (
          <span>Lucas Feliciano</span>
        )}
      </div>
    </motion.header>
  );
};