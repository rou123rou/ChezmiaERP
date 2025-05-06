declare global {
    namespace Slugify {
      function generateSlug(str: string): string;
    }
  }
  
  export {generateSlug}; // Ceci est nécessaire pour que TypeScript considère le fichier comme un moduledeclare module '../../utils/slugify' {
    
    
