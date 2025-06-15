import React from 'react';
import { motion } from 'framer-motion';
import { FileX, Home, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/felilabs/lucas-feliciano');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl w-full"
      >
        {/* 404 Icon Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="inline-block"
            >
              <FileX size={120} className="text-red-400 mx-auto" />
            </motion.div>
            
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-60"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-10, -20, -10],
                  opacity: [0.6, 0.2, 0.6],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-8xl sm:text-9xl font-mono font-bold text-transparent bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 bg-clip-text mb-4">
            404
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 mx-auto rounded-full" />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white mb-4">
            Arquivo Não Encontrado
          </h2>
          <p className="text-gray-400 text-lg mb-2">
            O caminho que você está procurando não existe no FeliLabs.
          </p>
          <p className="text-gray-500 text-sm font-mono">
            Verifique se o URL está correto ou navegue pelos arquivos disponíveis.
          </p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700"
        >
          <h3 className="text-lg font-mono font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Search size={20} className="text-blue-400" />
            Sugestões
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300">Projetos Populares:</h4>
              <ul className="text-sm text-gray-400 space-y-1 font-mono">
                <li>• React Portfolio</li>
                <li>• E-commerce Platform</li>
                <li>• Task Manager App</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300">Pesquisas:</h4>
              <ul className="text-sm text-gray-400 space-y-1 font-mono">
                <li>• Neural Networks</li>
                <li>• Data Science</li>
                <li>• TypeScript Advanced</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={handleGoHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-mono font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home size={18} />
            Ir para Início
          </motion.button>
          
          <motion.button
            onClick={handleGoBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-mono font-semibold rounded-lg border border-gray-600 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Voltar
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 pt-6 border-t border-gray-700"
        >
          <p className="text-gray-500 text-sm font-mono">
            FeliLabs - Espaço digital de Lucas Feliciano
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};