import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, User } from 'lucide-react';
import { FileSystemItem } from '../types/FileSystem';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ContentViewerProps {
  file: FileSystemItem | null;
}

export const ContentViewer: React.FC<ContentViewerProps> = ({ file }) => {
  if (!file) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center bg-gray-900 p-4"
      >
        <div className="text-center max-w-md">
          <FileText size={48} className="text-gray-600 mx-auto mb-4 sm:w-16 sm:h-16" />
          <h2 className="text-xl sm:text-2xl font-mono text-gray-400 mb-2">Bem-vindo ao FeliLabs</h2>
          <p className="text-sm sm:text-base text-gray-500 font-mono">Selecione um arquivo do explorador para visualizar seu conteúdo, sinta-se à vontade, terráqueo.</p>
          <p className="text-xs text-gray-500 mt-1">Desenvolvido por <a href="https://www.linkedin.com/in/lucas-feliciano-software/" className="text-blue-400 hover:underline">Lucas Feliciano</a>.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 bg-gray-900 overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={20} className="text-blue-400 flex-shrink-0 sm:w-6 sm:h-6" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-mono font-bold text-white truncate">{file.name}</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="flex-shrink-0" />
              <span>Visitado recentemente</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="flex-shrink-0" />
              <span><a href="https://www.linkedin.com/in/lucas-feliciano-software/" className="text-blue-400 hover:underline">Lucas Feliciano</a></span>
            </div>
          </div>
        </header>
        
        <article className="prose prose-invert max-w-none">
          {file.content ? (
            <MarkdownRenderer content={file.content} />
          ) : (
            <p className="text-gray-400 italic">Nenhum conteúdo disponível</p>
          )}
        </article>
      </div>
    </motion.div>
  );
};