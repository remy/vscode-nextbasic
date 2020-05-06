const vscode = require('vscode');
const { file2bas } = require('txt2bas');
const { dirname, basename } = require('path');
const fs = require('fs');

module.exports = main;

function main() {
  return vscode.commands.registerCommand('nextbasic.export', () => {
    try {
      const editor = vscode.window.activeTextEditor;
      const document = editor.document;

      const filePath = dirname(document.fileName);
      const defaultUri = vscode.Uri.file(filePath);
      const options = { defaultUri, filters: { BASIC: ['bas'] } };

      vscode.window.showSaveDialog(options).then((fileUri) => {
        if (fileUri) {
          fileUri = fileUri.path;
          const basFileName = basename(fileUri);
          const src = file2bas(document.getText());
          fs.writeFileSync(fileUri, src);
          vscode.window.showInformationMessage(
            'Successfully saved ' + basFileName
          );
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  });
}
