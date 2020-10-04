const vscode = require('vscode');
const { file2bas } = require('txt2bas');
const { dirname, basename, join } = require('path');
const fs = require('fs');

module.exports = main;

function exportCode({ bank = false, format = '3dos' } = {}) {
  try {
    const editor = vscode.window.activeTextEditor;
    const document = editor.document;
    const { stripComments } = vscode.workspace.getConfiguration('nextbasic');

    const program = document
      .getText()
      .replace(/\r/g, '')
      .split('\n')
      .filter((_) => _.startsWith('#program'))[0];

    const filePath = dirname(document.fileName);
    let defaultUri = vscode.Uri.file(filePath);
    if (program) {
      defaultUri = vscode.Uri.file(join(filePath, program.split(' ')[1]));
    }

    const options = {
      defaultUri,
      filters: { BASIC: [format === 'tap' ? 'tap' : 'bas'] },
    };

    vscode.window.showSaveDialog(options).then((fileUri) => {
      if (fileUri) {
        fileUri = fileUri.fsPath;
        const basFileName = basename(fileUri);

        if (basFileName.endsWith('.tap')) {
          format = 'tap';
        }
        try {
          const src = file2bas(document.getText(), {
            format,
            bank,
            stripComments,
            defines: true,
          });
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
}

function main() {
  return [
    vscode.commands.registerCommand('nextbasic.export', () => exportCode()),
    vscode.commands.registerCommand('nextbasic.bank-export', () =>
      exportCode({ bank: true })
    ),
    vscode.commands.registerCommand('nextbasic.tap-export', () =>
      exportCode({ format: 'tap' })
    ),
  ];
}
