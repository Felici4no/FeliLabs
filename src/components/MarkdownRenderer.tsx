import React from 'react';
import { motion } from 'framer-motion';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLanguage = '';
    let listItems: React.ReactNode[] = [];
    let inList = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 mb-4 ml-4">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          flushList();
          inCodeBlock = true;
          codeBlockLanguage = line.substring(3).trim();
          codeBlockContent = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <motion.div
              key={`code-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                {codeBlockLanguage && (
                  <div className="bg-gray-700 px-4 py-2 text-sm text-gray-300 font-mono border-b border-gray-600">
                    {codeBlockLanguage}
                  </div>
                )}
                <pre className="p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-gray-100 leading-relaxed">
                    {codeBlockContent.join('\n')}
                  </code>
                </pre>
              </div>
            </motion.div>
          );
          codeBlockContent = [];
          codeBlockLanguage = '';
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <motion.h1
            key={`h1-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-white mb-6 border-b border-gray-700 pb-3"
          >
            {line.substring(2)}
          </motion.h1>
        );
        return;
      }

      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <motion.h2
            key={`h2-${index}`}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-semibold text-gray-100 mb-4 mt-8"
          >
            {line.substring(3)}
          </motion.h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <motion.h3
            key={`h3-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-semibold text-gray-200 mb-3 mt-6"
          >
            {line.substring(4)}
          </motion.h3>
        );
        return;
      }

      if (line.startsWith('#### ')) {
        flushList();
        elements.push(
          <motion.h4
            key={`h4-${index}`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-semibold text-gray-300 mb-2 mt-4"
          >
            {line.substring(5)}
          </motion.h4>
        );
        return;
      }

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          inList = true;
        }
        const content = line.substring(2);
        listItems.push(
          <motion.li
            key={`li-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-gray-300"
            dangerouslySetInnerHTML={{ __html: processInlineFormatting(content) }}
          />
        );
        return;
      }

      // Numbered lists
      const numberedMatch = line.match(/^\d+\.\s+(.+)/);
      if (numberedMatch) {
        if (!inList) {
          inList = true;
        }
        listItems.push(
          <motion.li
            key={`li-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-gray-300 list-decimal"
            dangerouslySetInnerHTML={{ __html: processInlineFormatting(numberedMatch[1]) }}
          />
        );
        return;
      }

      // If we were in a list and this line doesn't continue it, flush the list
      if (inList && !line.startsWith('- ') && !line.startsWith('* ') && !line.match(/^\d+\.\s+/)) {
        flushList();
      }

      // Empty lines
      if (line.trim() === '') {
        if (!inList) {
          elements.push(<br key={`br-${index}`} />);
        }
        return;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        flushList();
        elements.push(
          <motion.blockquote
            key={`quote-${index}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-4 border-blue-400 pl-4 py-2 mb-4 bg-gray-800/50 rounded-r-lg"
          >
            <p 
              className="text-gray-300 italic"
              dangerouslySetInnerHTML={{ __html: processInlineFormatting(line.substring(2)) }}
            />
          </motion.blockquote>
        );
        return;
      }

      // Horizontal rules
      if (line.trim() === '---' || line.trim() === '***') {
        flushList();
        elements.push(
          <motion.hr
            key={`hr-${index}`}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="border-gray-700 my-8"
          />
        );
        return;
      }

      // Regular paragraphs
      if (line.trim() !== '') {
        flushList();
        elements.push(
          <motion.p
            key={`p-${index}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-300 mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processInlineFormatting(line) }}
          />
        );
      }
    });

    // Flush any remaining list items
    flushList();

    return elements;
  };

  const processInlineFormatting = (text: string): string => {
    return text
      // Code inline
      .replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-blue-300 font-mono text-sm">$1</code>')
      // Bold text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      // Italic text
      .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-200">$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
      // Strikethrough
      .replace(/~~([^~]+)~~/g, '<del class="line-through text-gray-500">$1</del>');
  };

  return (
    <div className="prose prose-invert max-w-none">
      <div className="font-mono text-sm leading-relaxed">
        {renderMarkdown(content)}
      </div>
    </div>
  );
};