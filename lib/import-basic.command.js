const vscode = require('vscode');
const { file2txt } = require('txt2bas');
const fs = require('fs');

module.exports = main;

function main() {
  return vscode.commands.registerCommand('nextbasic.import-basic', () => {
    try {
      const editor = vscode.window.activeTextEditor;
      const document = editor.document;
      const fullText = document.getText();

      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(fullText.length - 1)
      );
      const file = fs.readFileSync(document.fileName);
      const src = file2txt(new Uint8Array(file));
      editor.edit((editBuilder) => {
        editBuilder.delete(fullRange);
        editBuilder.insert(new vscode.Position(0, 0), src);
      });
    } catch (e) {
      console.log(e.message);
    }
  });
}
