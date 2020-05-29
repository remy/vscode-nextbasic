const vscode = require('vscode');
const { file2bas } = require('txt2bas');
const { dirname, basename, join } = require('path');
const fs = require('fs');

module.exports = main;

function main() {
  return vscode.commands.registerCommand('nextbasic.export', () => {
    try {
      const editor = vscode.window.activeTextEditor;
      const document = editor.document;

      const program = document
        .getText()
        .split('\n')
        .filter((_) => _.startsWith('#program'))[0];

      const filePath = dirname(document.fileName);
      let defaultUri = vscode.Uri.file(filePath);
      if (program) {
        defaultUri = vscode.Uri.file(join(filePath, program.split(' ')[1]));
      }

      const options = { defaultUri, filters: { BASIC: ['bas'] } };

      vscode.window.showSaveDialog(options).then((fileUri) => {
        if (fileUri) {
          fileUri = fileUri.fsPath;
          const basFileName = basename(fileUri);
          try {
            const src = file2bas(document.getText());
            fs.writeFileSync(fileUri, src);
            vscode.window.showInformationMessage(
              'Successfully saved ' + basFileName
            );
          } catch (e) {
            vscode.window.showErrorMessage('Failed to export: ' + e.message);
          }
        }
      });
    } catch (e) {
      console.log('export-basic.command');
      console.log(e.message);
    }
  });
}
