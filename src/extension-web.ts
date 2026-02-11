import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // 1. Activate Theme Command (Works in Web)
  let activateThemeDisposable = vscode.commands.registerCommand(
    'hadarIcons.activate',
    async () => {
      try {
        await vscode.workspace
          .getConfiguration('workbench')
          .update(
            'iconTheme',
            'hadar-icons',
            vscode.ConfigurationTarget.Global,
          );
        vscode.window.showInformationMessage('Hadar Icons theme activated!');
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Failed to activate theme: ${error.message}`,
        );
      }
    },
  );
  context.subscriptions.push(activateThemeDisposable);

  // 2. File System Dependent Commands (Not Supported in Web)
  const notSupportedMsg =
    'This command is not available in VS Code Web edition as it requires file system access.';

  const cmds = [
    'hadarIcons.changeFolderColor',
    'hadarIcons.configureIconPacks',
    'hadarIcons.toggleExplorerArrows',
  ];

  cmds.forEach((cmd) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(cmd, async () => {
        vscode.window.showInformationMessage(notSupportedMsg);
      }),
    );
  });
}

export function deactivate() {}
