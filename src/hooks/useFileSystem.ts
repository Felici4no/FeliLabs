import { useState, useEffect } from 'react';
import { FileSystemItem } from '../utils/fileSystemReader';
import { createFileSystemStructure } from '../utils/fileSystemReader';

export const useFileSystem = () => {
  const [data, setData] = useState<FileSystemItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API delay for future backend integration
        await new Promise(resolve => setTimeout(resolve, 300));
        const fileSystemData = await createFileSystemStructure();
        setData(fileSystemData);
      } catch (err) {
        setError('Failed to load file system data');
        console.error('Error loading file system:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const findFileByPath = (path: string[], root: FileSystemItem): FileSystemItem | null => {
    if (path.length === 0) return root;
    
    let current = root;
    for (const segment of path) {
      if (!current.children) return null;
      const found = current.children.find(item => item.name === segment);
      if (!found) return null;
      current = found;
    }
    return current;
  };

  return {
    data,
    loading,
    error,
    findFileByPath
  };
};