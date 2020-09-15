const vscode = require('vscode');
const { EOL } = require('os');
const { formatText } = require('txt2bas');
const isAutoLine = require('./is-autoline');

module.exports = main;

const format = (module.exports.format = (document, position) => {
  try {
    const line = document.lineAt(position.line - 1).text;
    if (line.trim() === '') return;

    const formatted = formatText(line, true);
    const editor = vscode.window.activeTextEditor;
    return editor.edit((editBuilder) => {
      editBuilder.replace(
        new vscode.Range(
          new vscode.Position(position.line - 1, 0),
          new vscode.Position(position.line - 1, line.length)
        ),
        formatted
      );
    });
  } catch (e) {
    console.log('format error');
    console.log(e);
  }
});

function main() {
  return vscode.languages.registerOnTypeFormattingEditProvider(
    ['nextbasic'],
    { provideOnTypeFormattingEdits: format },
    EOL
  );
}
