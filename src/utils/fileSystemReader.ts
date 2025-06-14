// src/utils/fileSystemReader.ts

export interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileSystemItem[];
  content?: string;
}

// Importa todos os arquivos .md como texto puro (raw) dentro da pasta /src/felilabs/
const mdModules = import.meta.glob('/src/felilabs/**/*.md', { as: 'raw' });

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
                name: 'React-Portfolio.md',
                type: 'file',
                path: 'lucas-feliciano/projetos/web-development/React-Portfolio.md',
              },
              {
                name: 'E-commerce-Platform.md',
                type: 'file',
                path: 'lucas-feliciano/projetos/web-development/E-commerce-Platform.md',
              }
            ]
          },
          {
            name: 'mobile-apps',
            type: 'folder',
            path: 'lucas-feliciano/projetos/mobile-apps',
            children: [
              {
                name: 'Task-Manager-App.md',
                type: 'file',
                path: 'lucas-feliciano/projetos/mobile-apps/Task-Manager-App.md',
              }
            ]
          }
        ]
      },
      {
        name: 'pesquisa',
        type: 'folder',
        path: 'lucas-feliciano/pesquisa',
        children: [
          {
            name: 'ai-machine-learning',
            type: 'folder',
            path: 'lucas-feliciano/pesquisa/ai-machine-learning',
            children: [
              {
                name: 'Neural-Networks.md',
                type: 'file',
                path: 'lucas-feliciano/pesquisa/ai-machine-learning/Neural-Networks.md',
              },
              {
                name: 'Data-Science.md',
                type: 'file',
                path: 'lucas-feliciano/pesquisa/ai-machine-learning/Data-Science.md',
              }
            ]
          }
        ]
      },
      {
        name: 'notas',
        type: 'folder',
        path: 'lucas-feliciano/notas',
        children: [
          {
            name: 'aprendizado',
            type: 'folder',
            path: 'lucas-feliciano/notas/aprendizado',
            children: [
              {
                name: 'TypeScript-Advanced.md',
                type: 'file',
                path: 'lucas-feliciano/notas/aprendizado/TypeScript-Advanced.md',
              }
            ]
          },
          {
            name: 'ideias.md',
            type: 'file',
            path: 'lucas-feliciano/notas/ideias.md',
          }
        ]
      }
    ]
  };

  await loadFileContents(structure);
  return structure;
}

async function loadFileContents(item: FileSystemItem): Promise<void> {
  if (item.type === 'file' && item.path.endsWith('.md')) {
    const relativePath = `/src/felilabs/${item.path}`;
    const matchedKey = Object.keys(mdModules).find(key => key.endsWith(item.path));

    if (matchedKey) {
      try {
        const content = await mdModules[matchedKey]();
        item.content = content;
      } catch (error) {
        console.warn(`Erro carregando ${item.path}:`, error);
        item.content = `# ${item.name}\n\nErro ao carregar conteúdo.`;
      }
    } else {
      console.warn(`Arquivo não encontrado: ${item.path}`);
      item.content = `# ${item.name}\n\nArquivo não encontrado.`;
    }
  }

  if (item.children) {
    await Promise.all(item.children.map(loadFileContents));
  }
}
