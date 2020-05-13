const vscode = require('vscode');
const { file2bas } = require('txt2bas');
const { dirname, basename } = require('path');
const fs = require('fs');

module.exports = main;

function indent(outdent = false) {
  try {
    const editor = vscode.window.activeTextEditor;
    const document = editor.document;
    const selection = editor.selection;
    const nLines = selection.end.line - selection.start.line + 1;

    // handle indentation on each line
    editor.edit((editBuilder) => {
      for (let i = 0; i < nLines; i++) {
        const lineNum = selection.start.line + i;

        const line = document.lineAt(lineNum).text;

        const start = new vscode.Position(lineNum, 0);
        const end = new vscode.Position(lineNum, line.length);

        // decide whether to remove or add
        let [num, ...rest] = line.split(' ');
        editBuilder.delete(new vscode.Range(start, end));
        if (outdent === false) {
          editBuilder.insert(start, `${num} ${'  '}${rest.join(' ')}`);
        } else {
          for (let i = 0; i < 2; i++) {
            if (rest[0] === '') rest.shift();
          }
          editBuilder.insert(start, `${num} ${rest.join(' ')}`);
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
}

function main() {
  return [
    vscode.commands.registerCommand('nextbasic.indentLines', () =>
      indent(false)
    ),
    vscode.commands.registerCommand('nextbasic.unindentLines', () =>
      indent(true)
    ),
  ];
}
