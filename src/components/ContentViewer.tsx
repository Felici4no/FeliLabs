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
        className="flex-1 flex items-center justify-center bg-gray-900"
      >
        <div className="text-center">
          <FileText size={64} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-mono text-gray-400 mb-2">Bem-vindo ao FeliLabs</h2>
          <p className="text-gray-500 font-mono">Selecione um arquivo do explorador para visualizar seu conteúdo</p>
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
      <div className="max-w-4xl mx-auto p-8">
        <header className="mb-8 pb-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={24} className="text-blue-400" />
            <h1 className="text-2xl font-mono font-bold text-white">{file.name}</h1>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Última atualização: Hoje</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Lucas Feliciano</span>
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