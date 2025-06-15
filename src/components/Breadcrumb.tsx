import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  path: string[];
  onNavigate: (index: number) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="md:hidden flex items-center gap-2 p-3 bg-gray-800 border-b border-gray-700 overflow-x-auto"
    >
      <button
        onClick={() => onNavigate(-1)}
        className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors flex-shrink-0"
      >
        <Home size={14} />
        <span className="font-mono text-xs">Início</span>
      </button>
      
      {path.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} className="text-gray-600 flex-shrink-0" />
          <button
            onClick={() => onNavigate(index)}
            className="font-mono text-xs text-gray-400 hover:text-white transition-colors whitespace-nowrap"
          >
            {segment}
          </button>
        </React.Fragment>
      ))}
    </motion.nav>
  );
};