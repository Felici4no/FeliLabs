import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileExplorer } from './components/FileExplorer';
import { ContentViewer } from './components/ContentViewer';
import { Breadcrumb } from './components/Breadcrumb';
import { useFileSystem } from './hooks/useFileSystem';
import { FileSystemItem } from './types/FileSystem';
import { Loader2 } from 'lucide-react';

function App() {
  const { data, loading, error } = useFileSystem();
  const [selectedFile, setSelectedFile] = useState<FileSystemItem | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  useEffect(() => {
    // Auto-select the About.md file on first load
    if (data && !selectedFile) {
      const aboutFile = data.children?.find(item => item.name === 'About.md');
      if (aboutFile) {
        setSelectedFile(aboutFile);
      }
    }
  }, [data, selectedFile]);

  const handleFileSelect = (file: FileSystemItem) => {
    setSelectedFile(file);
  };

  const handleNavigate = (path: string[]) => {
    setCurrentPath(path);
  };

  const handleBreadcrumbNavigate = (index: number) => {
    if (index === -1) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 size={48} className="text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-mono">Carregando FeliLabs...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700"
        >
          <h2 className="text-xl font-mono text-red-400 mb-2">Erro ao Carregar FeliLabs</h2>
          <p className="text-gray-400">{error || 'Erro desconhecido ocorreu'}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-screen"
      >
        <div className="w-80 flex-shrink-0">
          <FileExplorer
            data={data}
            onFileSelect={handleFileSelect}
            onNavigate={handleNavigate}
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <Breadcrumb
            path={currentPath}
            onNavigate={handleBreadcrumbNavigate}
          />
          
          <AnimatePresence mode="wait">
            <ContentViewer
              key={selectedFile?.name || 'empty'}
              file={selectedFile}
            />
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default App;