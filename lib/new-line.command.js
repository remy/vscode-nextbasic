const vscode = require('vscode');
const { format } = require('./format-on-type.provider');
module.exports = main;

function main() {
  return vscode.commands.registerCommand(
    'nextbasic.new-line-with-number',
    newLine
  );
}

function newLine() {
  try {
    // The code you place here will be executed every time your command is executed
    const editor = vscode.window.activeTextEditor;
    const document = editor.document;
    const selection = editor.selection;
    const position = selection.end;

    const currentPosition = document.getWordRangeAtPosition(
      new vscode.Position(position.line, 0)
    );
    let currentLine = currentPosition
      ? document.getText(currentPosition).split(' ')[0]
      : null;

    format(document, { line: selection.start.line + 1 });

    // if we can't find anything, just drop in a new line, we're nice like that.
    if (currentLine === null) {
      editor.insertSnippet(
        new vscode.SnippetString(`$0\n`),
        new vscode.Position(position.line + 1, 0)
      );
      return;
    }

    const nextLinePos = document.getWordRangeAtPosition(
      new vscode.Position(position.line + 1, 0)
    );

    let nextLine = nextLinePos
      ? document.getText(nextLinePos).split(' ')[0]
      : '9999';

    if (currentLine && nextLine) {
      currentLine = parseInt(currentLine, 10);

      if (isNaN(currentLine)) {
        return;
      }

      nextLine = parseInt(nextLine, 10);

      if (isNaN(nextLine)) {
        nextLine = 9999;
      }

      let d = currentLine + (((nextLine - currentLine) / 2) | 0);
      if (d !== nextLine && d !== currentLine) {
        if (d - currentLine > 10) d = currentLine + 10;
      }

      const onLastLine =
        position.line + 1 === document.getText().split('\n').length;

      editor.insertSnippet(
        new vscode.SnippetString(`${onLastLine ? '\n' : ''}${d} $0\n`),
        new vscode.Position(position.line + 1, 0)
      );
    }
  } catch (e) {
    console.log(e.message);
  }
}
