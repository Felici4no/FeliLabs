// Utility to dynamically import all markdown files from the felilabs directory
export interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileSystemItem[];
  content?: string;
}

// Function to create the file system structure
export async function createFileSystemStructure(): Promise<FileSystemItem> {
  const structure: FileSystemItem = {
    name: 'Lucas Feliciano',
    type: 'folder',
    path: 'lucas-feliciano',
    children: [
      {
        name: 'About.md',
        type: 'file',
        path: 'lucas-feliciano/About.md',
      },
      {
        name: 'projetos',
        type: 'folder',
        path: 'lucas-feliciano/projetos',
        children: [
          {
            name: 'web-development',
            type: 'folder',
            path: 'lucas-feliciano/projetos/web-development',
            children: [
              {
                name: 'FeliQuiz.md',
                type: 'file',
                path: 'lucas-feliciano/projetos/web-development/FeliQuiz.md',
              }
            ]
          },
          {
            name: 'Fiap',
            type: 'folder',
            path: 'lucas-feliciano/projetos/fiap',
            children: [
              {
                name: 'EcoSimulator.md',
                type: 'file',
                path: 'lucas-feliciano/projetos/fiap/EcoSimulator.md',
              }
            ]
          }
        ]
      }
    ]
  };

  await loadFileContents(structure);
  return structure;
}

// Uses Vite's import.meta.glob to safely import .md files as raw text
const markdownModules = import.meta.glob('../felilabs/**/*.md', { as: 'raw' });

async function loadFileContents(item: FileSystemItem): Promise<void> {
  if (item.type === 'file' && item.path.endsWith('.md')) {
    const pathKey = `../felilabs/${item.path}`;
    const loader = markdownModules[pathKey];

    if (loader) {
      try {
        item.content = await loader();
      } catch (error) {
        console.warn(`Erro ao carregar ${item.path}:`, error);
        item.content = `# ${item.name.replace('.md', '')}\n\nErro ao carregar conteúdo.`;
      }
    } else {
      item.content = `# ${item.name.replace('.md', '')}\n\nConteúdo não encontrado.`;
    }
  }

  if (item.children) {
    await Promise.all(item.children.map(loadFileContents));
  }
}