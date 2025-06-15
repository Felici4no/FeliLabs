import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, File, Folder, FolderOpen, Search } from 'lucide-react';
import { FileSystemItem, NavigationState } from '../types/FileSystem';

interface FileExplorerProps {
  data: FileSystemItem;
  onFileSelect: (file: FileSystemItem) => void;
  onNavigate: (path: string[]) => void;
  selectedFile: FileSystemItem | null;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  data, 
  onFileSelect, 
  onNavigate, 
  selectedFile 
}) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentPath: [],
    selectedFile: null,
    expandedFolders: new Set(['Lucas Feliciano'])
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<FileSystemItem[]>([]);

  // Update navigation state when selectedFile changes
  useEffect(() => {
    if (selectedFile) {
      setNavigationState(prev => ({
        ...prev,
        selectedFile: selectedFile
      }));
    }
  }, [selectedFile]);

  useEffect(() => {
    if (searchTerm) {
      const searchItems = (items: FileSystemItem[], path: string[] = []): FileSystemItem[] => {
        let results: FileSystemItem[] = [];
        
        items.forEach(item => {
          const currentPath = [...path, item.name];
          if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push(item);
          }
          if (item.children) {
            results = [...results, ...searchItems(item.children, currentPath)];
          }
        });
        
        return results;
      };
      
      setFilteredItems(searchItems([data]));
    } else {
      setFilteredItems([]);
    }
  }, [searchTerm, data]);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(navigationState.expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setNavigationState(prev => ({
      ...prev,
      expandedFolders: newExpanded
    }));
  };

  const handleFileClick = (file: FileSystemItem) => {
    if (file.type === 'file') {
      onFileSelect(file);
    }
  };

  const renderFileSystemItem = (item: FileSystemItem, level: number = 0, path: string = '') => {
    const currentPath = path ? `${path}/${item.name}` : item.name;
    const isExpanded = navigationState.expandedFolders.has(currentPath);
    const isSelected = selectedFile?.path === item.path;

    return (
      <motion.div
        key={currentPath}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: level * 0.05 }}
        className="select-none"
      >
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700/50 ${
            isSelected ? 'bg-blue-600/20 border-l-2 border-blue-400' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(currentPath);
            } else {
              handleFileClick(item);
            }
          }}
        >
          {item.type === 'folder' ? (
            <>
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronRight size={14} className="text-gray-400" />
              </motion.div>
              {isExpanded ? (
                <FolderOpen size={16} className="text-blue-400 flex-shrink-0" />
              ) : (
                <Folder size={16} className="text-blue-400 flex-shrink-0" />
              )}
            </>
          ) : (
            <>
              <div className="w-3.5 flex-shrink-0" />
              <File size={14} className="text-gray-400 flex-shrink-0" />
            </>
          )}
          <span className="text-gray-200 font-mono text-sm hover:text-white transition-colors truncate">
            {item.name}
          </span>
        </div>
        
        <AnimatePresence>
          {item.type === 'folder' && isExpanded && item.children && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {item.children.map(child => 
                renderFileSystemItem(child, level + 1, currentPath)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderSearchResults = () => {
    if (!searchTerm || filteredItems.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Resultados da Busca ({filteredItems.length})
        </h3>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {filteredItems.map((item, index) => (
            <div
              key={`search-${index}`}
              className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-700/50 transition-colors"
              onClick={() => handleFileClick(item)}
            >
              {item.type === 'file' ? (
                <File size={12} className="text-gray-400 flex-shrink-0" />
              ) : (
                <Folder size={12} className="text-blue-400 flex-shrink-0" />
              )}
              <span className="text-xs text-gray-200 font-mono truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full bg-gray-900 border-r border-gray-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar arquivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors font-mono"
          />
        </div>
      </div>
      
      <div className="p-4">
        {renderSearchResults()}
        {renderFileSystemItem(data)}
      </div>
    </div>
  );
};