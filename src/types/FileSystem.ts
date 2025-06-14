export interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileSystemItem[];
  content?: string;
}

export interface NavigationState {
  currentPath: string[];
  selectedFile: FileSystemItem | null;
  expandedFolders: Set<string>;
}