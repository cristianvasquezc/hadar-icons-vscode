import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { IconPack, packs } from './packs';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'hadarIcons.changeFolderColor',
    async () => {
      // Web check: fs is not available in web
      if (vscode.env.appHost !== 'desktop') {
        vscode.window.showInformationMessage(
          'Icon customization is only available in VS Code Desktop.',
        );
        return;
      }

      const options: vscode.QuickPickItem[] = [
        {
          label: 'Hadar Mint',
          description: '#00B09C',
          detail: 'Refreshing & Balanced',
        },
        {
          label: 'Hadar Cherry',
          description: '#D64045',
          detail: 'Energetic & Bold',
        },
        {
          label: 'Hadar Golden',
          description: '#FF9F1C',
          detail: 'Warm & High Contrast',
        },
        {
          label: 'Hadar Lime',
          description: '#AACC00',
          detail: 'Vibrant & Sharp',
        },
        {
          label: 'Custom Color...',
          description: 'Enter a custom hex color',
          detail: 'Define your unique style',
        },
      ];

      const selection = await vscode.window.showQuickPick(options, {
        placeHolder: 'Select a color for folder icons',
      });

      if (!selection) {
        return;
      }

      let selectedColor = '';

      if (selection.label === 'Custom Color...') {
        const input = await vscode.window.showInputBox({
          prompt: 'Enter a Hex color code (e.g., #123456)',
          placeHolder: '#RRGGBB',
          validateInput: (text) => {
            const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            return hexRegex.test(text) ? null : 'Invalid Hex color code';
          },
        });

        if (!input) {
          return;
        }
        selectedColor = input;
      } else {
        selectedColor = selection.description!;
      }

      // Normalize color to 6 hex digits if 3 are provided
      if (selectedColor.length === 4) {
        selectedColor =
          '#' +
          selectedColor[1] +
          selectedColor[1] +
          selectedColor[2] +
          selectedColor[2] +
          selectedColor[3] +
          selectedColor[3];
      }

      selectedColor = selectedColor.toUpperCase();

      try {
        await updateIconFiles(context, selectedColor);
        const reload = await vscode.window.showInformationMessage(
          `Hadar Icons updated to ${selectedColor}. Reload window to apply changes?`,
          'Reload',
        );
        if (reload === 'Reload') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Failed to update icons: ${error.message}`,
        );
      }
    },
  );

  context.subscriptions.push(disposable);

  let configurePacksDisposable = vscode.commands.registerCommand(
    'hadarIcons.configureIconPacks',
    async () => {
      // Find currently active pack from globalState
      const activePackName = context.globalState.get<string>(
        'hadarIcons.activeIconPack',
        'angular',
      );

      const selectedPack = await vscode.window.showQuickPick(
        packs.map((pack) => ({
          label: pack.label,
          description: pack.name === activePackName ? '(Active)' : '',
          detail: pack.detail,
          pack: pack,
        })),
        {
          canPickMany: false,
          placeHolder: 'Select an icon pack configuration',
        },
      );

      if (selectedPack) {
        // Update state
        await context.globalState.update(
          'hadarIcons.activeIconPack',
          selectedPack.pack.name,
        );

        try {
          await updateIconPacks(context, selectedPack.pack);
          const reload = await vscode.window.showInformationMessage(
            `Icon pack set to ${selectedPack.label}. Reload window to apply changes?`,
            'Reload',
          );
          if (reload === 'Reload') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
          }
        } catch (error: any) {
          vscode.window.showErrorMessage(
            `Failed to update icon packs: ${error.message}`,
          );
        }
      }
    },
  );

  context.subscriptions.push(configurePacksDisposable);
}

async function updateIconPacks(
  context: vscode.ExtensionContext,
  activePack: IconPack,
) {
  const themesDir = path.join(context.extensionPath, 'themes');
  const jsonPath = path.join(themesDir, 'hadar-icons.json');

  if (!fs.existsSync(jsonPath)) {
    return;
  }

  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const config = JSON.parse(jsonContent);

  if (!config.fileExtensions) {
    config.fileExtensions = {};
  }

  // 1. Remove all extensions managed by ANY pack to ensure clean state
  for (const pack of packs) {
    for (const ext of Object.keys(pack.fileExtensions)) {
      if (config.fileExtensions[ext]) {
        delete config.fileExtensions[ext];
      }
    }
  }

  // 2. Add extensions from ACTIVE pack
  for (const [ext, icon] of Object.entries(activePack.fileExtensions)) {
    config.fileExtensions[ext] = icon;
  }

  fs.writeFileSync(jsonPath, JSON.stringify(config, null, 2), 'utf8');
}

async function updateIconFiles(
  context: vscode.ExtensionContext,
  color: string,
) {
  const iconsDir = path.join(context.extensionPath, 'icons');
  const themesDir = path.join(context.extensionPath, 'themes');
  const jsonPath = path.join(themesDir, 'hadar-icons.json');

  // Templates (original files)
  const folderSrc = path.join(iconsDir, 'folder.svg');
  const folderOpenSrc = path.join(iconsDir, 'folder-open.svg');

  if (!fs.existsSync(folderSrc) || !fs.existsSync(folderOpenSrc)) {
    throw new Error('Base icon files not found.');
  }

  // Generate unique timestamp for cache busting
  const timestamp = new Date().getTime();
  const newFolderIconName = `folder-${timestamp}.svg`;
  const newFolderOpenIconName = `folder-open-${timestamp}.svg`;

  const newFolderIconPath = path.join(iconsDir, newFolderIconName);
  const newFolderOpenIconPath = path.join(iconsDir, newFolderOpenIconName);

  // Generate new colored icons
  await generateColoredIcon(folderSrc, newFolderIconPath, color);
  await generateColoredIcon(folderOpenSrc, newFolderOpenIconPath, color);

  // Update hadar-icons.json to point to new files
  if (fs.existsSync(jsonPath)) {
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const config = JSON.parse(jsonContent);

    if (config.iconDefinitions) {
      if (config.iconDefinitions.folder) {
        config.iconDefinitions.folder.iconPath = `../icons/${newFolderIconName}`;
      }
      if (config.iconDefinitions['folder-open']) {
        config.iconDefinitions['folder-open'].iconPath =
          `../icons/${newFolderOpenIconName}`;
      }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(config, null, 2), 'utf8');

    // Clean up old generated files
    cleanupOldFiles(iconsDir, timestamp);
  }
}

async function generateColoredIcon(
  srcPath: string,
  destPath: string,
  color: string,
) {
  let content = fs.readFileSync(srcPath, 'utf8');
  // Regex to replace .st0{fill:#...;}
  const regex = /\.st0\{fill:#[0-9A-Fa-f]{6};\}/g;

  if (regex.test(content)) {
    const newStyle = `.st0{fill:${color};}`;
    content = content.replace(regex, newStyle);
  } else {
    console.warn(`Pattern not found in ${srcPath}`);
  }

  fs.writeFileSync(destPath, content, 'utf8');
}

function cleanupOldFiles(iconsDir: string, currentTimestamp: number) {
  try {
    const files = fs.readdirSync(iconsDir);
    const folderRegex = /^folder-(\d+)\.svg$/;
    const folderOpenRegex = /^folder-open-(\d+)\.svg$/;

    files.forEach((file) => {
      let match = file.match(folderRegex);
      if (!match) {
        match = file.match(folderOpenRegex);
      }

      if (match) {
        const fileTimestamp = parseInt(match[1], 10);
        // Delete if it's not the current timestamp
        if (fileTimestamp !== currentTimestamp) {
          const filePath = path.join(iconsDir, file);
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error(`Failed to delete old icon file: ${file}`, err);
          }
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up old files:', error);
  }
}

export function deactivate() {}
