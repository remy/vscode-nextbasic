const vscode = require('vscode');
const { format } = require('./format-on-type.provider');
module.exports = main;

function main() {
  return vscode.commands.registerCommand(
    'nextbasic.new-line-with-number',
    newLine
  );
}

async function newLine() {
  const editor = vscode.window.activeTextEditor;
  const document = editor.document;
  const selection = editor.selection;
  const position = selection.end;
  try {
    // The code you place here will be executed every time your command is executed

    const { newLineOnEnter } = vscode.workspace.getConfiguration('nextbasic');

    if (!newLineOnEnter) {
      throw new Error('noop');
    }

    const lines = document.getText().split('\n').length;

    if (position.line === lines - 1) {
      throw new Error('last line');
    }

    const currentPosition = document.getWordRangeAtPosition(
      new vscode.Position(position.line, 0)
    );
    let currentLine = currentPosition
      ? document.getText(currentPosition).split(' ')[0]
      : null;
    let moveLine = false;

    const rest = document.lineAt(position.line).text.substr(position.character);

    if (rest.trim() !== '') {
      moveLine = true;
    }

    await format(document, { line: selection.start.line + 1 });

    // if we can't find anything, just drop in a new empty line
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

      if (nextLine === currentLine || nextLine === currentLine + 1) {
        throw new Error('no more space');
      }

      await editor.edit((editBuilder) => {
        const line = document.lineAt(position.line).text;
        const start = position;
        const end = new vscode.Position(position.line, line.length);

        if (moveLine) {
          editBuilder.replace(new vscode.Range(start, end), `\n${d} ${rest}`);
        } else {
          editBuilder.insert(start, `\n${d} `);
        }
      });

      const pos = new vscode.Position(
        position.line + 1,
        d.toString().length + 1
      );
      editor.selections = [new vscode.Selection(pos, pos)];
    }
  } catch (e) {
    editor.insertSnippet(
      new vscode.SnippetString(`\n$0`),
      new vscode.Position(
        position.line,
        document.lineAt(position.line).text.length
      )
    );
    return;
  }
}
