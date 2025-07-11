import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { FileExplorer } from './components/FileExplorer';
import { ContentViewer } from './components/ContentViewer';
import { Header } from './components/Header';
import { NotFound } from './components/NotFound';
import { useFileSystem } from './hooks/useFileSystem';
import { FileSystemItem } from './types/FileSystem';
import { Loader2 } from 'lucide-react';

function App() {
  const { data, loading, error } = useFileSystem();
  const [selectedFile, setSelectedFile] = useState<FileSystemItem | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      const pathSegments = location.pathname
        .replace(/^\//, '')
        .split('/')
        .filter(Boolean);

      if (pathSegments[0] !== 'LucasFeliciano') {
        navigate('/LucasFeliciano');
        return;
      }

      const adjustedSegments = pathSegments.slice(1);
      const file = findFileByPath(['Lucas Feliciano', ...adjustedSegments], data);

      if (file) {
        setSelectedFile(file);
        setCurrentPath(adjustedSegments);
      }
    }
  }, [location.pathname, data]);

  const findFileByPath = (pathSegments: string[], node: FileSystemItem): FileSystemItem | null => {
    let current = node;
    for (const segment of pathSegments) {
      if (!current.children) return null;
      const match = current.children.find(item => item.name === segment);
      if (!match) return null;
      current = match;
    }
    return current;
  };

  const handleFileSelect = (file: FileSystemItem) => {
    setSelectedFile(file);
    navigate(`/${file.path.replace('Lucas Feliciano', 'LucasFeliciano')}`);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleBreadcrumbNavigate = (index: number) => {
    const newPath = index === -1 ? [] : currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    navigate(`/LucasFeliciano/${newPath.join('/')}`);
  };

  const FileSystemInterface = () => (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-screen">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPath={currentPath}
          onBreadcrumbNavigate={handleBreadcrumbNavigate}
        />

        <div className="flex flex-1 relative">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          <motion.div
            initial={false}
            animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-80 flex-shrink-0 fixed lg:relative h-full z-40 lg:z-auto top-16 lg:top-0"
          >
            <FileExplorer
              data={data!}
              onFileSelect={handleFileSelect}
              onNavigate={setCurrentPath}
              selectedFile={selectedFile}
            />
          </motion.div>

          <div className="flex-1 flex flex-col lg:ml-0">
            <AnimatePresence mode="wait">
              <ContentViewer key={selectedFile?.name || 'empty'} file={selectedFile} />
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Loader2 size={48} className="text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-mono">Carregando FeliLabs...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700 max-w-md w-full"
        >
          <h2 className="text-xl font-mono text-red-400 mb-2">Erro ao Carregar FeliLabs</h2>
          <p className="text-gray-400">{error || 'Erro desconhecido ocorreu'}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<FileSystemInterface />} />
      <Route path="/LucasFeliciano/*" element={<FileSystemInterface />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;