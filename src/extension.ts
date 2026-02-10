import * as fs from 'fs';
import * as path from 'path';
import { config } from './config';
import { IconTheme } from './types';

const distDir = path.join(__dirname, '../themes');

// Ensure themes directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Function to adjust paths to be relative to the dist folder
function adjustPaths(theme: IconTheme): IconTheme {
  const newTheme: any = { ...theme };

  newTheme.file = theme.file;
  newTheme.folder = theme.folder;
  newTheme.folderExpanded = theme.folderExpanded;
  newTheme.rootFolder = theme.rootFolder;
  newTheme.rootFolderExpanded = theme.rootFolderExpanded;

  if (newTheme.iconDefinitions) {
    const newDefs: any = {};
    for (const [key, def] of Object.entries(newTheme.iconDefinitions)) {
      let iconPath = (def as any).iconPath;
      if (iconPath.startsWith('./')) {
        iconPath = '..' + iconPath.substring(1);
      } else if (iconPath.startsWith('icons/')) {
        iconPath = '../' + iconPath;
      }

      newDefs[key] = { iconPath };
    }
    newTheme.iconDefinitions = newDefs;
  }
  return newTheme;
}

const finalConfig = adjustPaths(config);

const outputPath = path.join(distDir, 'hadar-icons.json');
fs.writeFileSync(outputPath, JSON.stringify(finalConfig, null, 2));

console.log(`Icon theme generated at ${outputPath}`);
