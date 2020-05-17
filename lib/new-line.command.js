const vscode = require('vscode');
const { format } = require('./format-on-type.provider');
const { statements: getStatements } = require('txt2bas');
module.exports = main;

function main() {
  return vscode.commands.registerTextEditorCommand(
    'nextbasic.new-line-with-number',
    newLine
  );
}

async function newLine(textEditor, editor) {
  const document = textEditor.document;
  const selection = textEditor.selection;
  const position = selection.end;
  try {
    // The code you place here will be executed every time your command is executed

    const { newLineOnEnter } = vscode.workspace.getConfiguration('nextbasic');

    if (!newLineOnEnter) {
      throw new Error('noop');
    }

    const lineText = document.lineAt(position.line).text;
    const SOL = new vscode.Position(position.line, 0);
    const EOL = new vscode.Position(position.line, lineText.length);
    // const currentPosition = document.getWordRangeAtPosition(SOL);
    let currentLine = lineText.trim().split(' ')[0];
    let moveLine = false;

    const rest = lineText.substr(position.character);

    if (lineText.trim().match(/^\d+$/)) {
      // empty line, let's nuke it for the user
      editor.delete(new vscode.Range(SOL, EOL));
      return;
    }

    if (rest.trim() !== '') {
      moveLine = true;
    }

    await format(document, { line: selection.start.line + 1 });
    const source = document.getText();

    // if we can't find anything, just drop in a new empty line
    if (currentLine === null) {
      await textEditor.edit((editor) => {
        editor.insert(SOL, '\n');
      });
      const pos = new vscode.Position(SOL.line + 1, 0);
      textEditor.selections = [new vscode.Selection(pos, pos)];
      return;
    }

    currentLine = parseInt(currentLine, 10);

    let statements = [];
    try {
      statements = getStatements(source);
    } catch (e) {}

    const index = statements.findIndex((_) => _.lineNumber === currentLine);
    let nextLine = (statements[index + 1] || { lineNumber: 9999 }).lineNumber;

    const lines = document.lineCount.length;
    const isLastLine = position.line === lines - 1;
    if (isLastLine) {
      if (currentLine === 9999) {
        throw new Error('last line');
      }
    }

    if (currentLine && nextLine) {
      if (isNaN(currentLine)) {
        throw new Error('NaN on current line');
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
        throw new Error(`no more space: ${currentLine}, ${nextLine}`);
      }

      await textEditor.edit((editBuilder) => {
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
      textEditor.selections = [new vscode.Selection(pos, pos)];
    } else {
      throw new Error('blank line');
    }
  } catch (e) {
    await textEditor.edit((editor) => {
      editor.replace(
        new vscode.Range(
          textEditor.selection.anchor,
          textEditor.selection.active
        ),
        '\n'
      );
    });
    const pos = new vscode.Position(position.line + 1, 0);
    textEditor.selections = [new vscode.Selection(pos, pos)];
    return;
  }
}
