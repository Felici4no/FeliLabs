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
        name: 'Carta de Apresentação',
        type: 'file',
        path: 'lucas-feliciano/Lucas.md',
      },
      {
        name: 'Projetos',
        type: 'folder',
        path: 'lucas-feliciano/projetos',
        children: [
              {
                name: 'FeliLabs',
                type: 'file',
                path: 'lucas-feliciano/About.md',
              },
//              {
//                name: 'FeliQuiz',
//                type: 'file',
//                path: 'lucas-feliciano/projetos/web-development/FeliQuiz.md',
//              },
              {
                name: 'EcoSimulator',
                type: 'file',
                path: 'lucas-feliciano/projetos/fiap/EcoSimulator.md',
              }
            ]
      },{
        name: 'Skills',
        type: 'folder',
        path: 'lucas-feliciano/skills',
        children: [
              {
                name: 'Soft skills',
                type: 'file',
                path: 'lucas-feliciano/skills/SoftSkills.md',
              },
              {
                name: 'Hard skills',
                type: 'file',
                path: 'lucas-feliciano/skills/HardSkills.md',
              }
            ]
      },{
        name: 'Certificados',
        type: 'folder',
        path: 'lucas-feliciano/certificados',
        children: [
              {
                name: 'Cursos de Formação e Aprendizado',
                type: 'file',
                path: 'lucas-feliciano/certificados/cursos-de-formacao-e-aprendizado.md',

              },
              {
                name: 'Certificações Técnicas',
                type: 'file',
                path: 'lucas-feliciano/certificados/certificacoes-tecnicas.md',

              },
              {
                name: 'Certificados de Participação ou Eventos',
                type: 'file',
                path: 'lucas-feliciano/certificados/certificados-de-participacao-ou-eventos.md',

              }
            ]
      },{
        name: 'Links',
        type: 'folder',
        path: 'lucas-feliciano/links',
        children: [
              {
                name: 'Links',
                type: 'file',
                path: 'lucas-feliciano/links/links.md',

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