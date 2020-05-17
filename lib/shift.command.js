const vscode = require('vscode');
const { shift } = require('txt2bas');
module.exports = main;

function hook() {
  return [
    vscode.commands.registerTextEditorCommand(
      'editor.action.moveLinesUpAction',
      (textEditor, editor) => shiftUp(textEditor, editor, -1)
    ),
    vscode.commands.registerTextEditorCommand(
      'editor.action.moveLinesDownAction',
      (textEditor, editor) => shiftUp(textEditor, editor, 1)
    ),
  ];
}

function main() {
  let handlers = hook();

  vscode.window.onDidChangeActiveTextEditor(() => {
    const document = vscode.window.activeTextEditor.document;
    if (document.languageId !== 'nextbasic') {
      handlers.forEach((h) => h.dispose()); // dispose
    } else {
      handlers = hook();
    }
  });

  return handlers;
}

async function shiftUp(textEditor, editor, forward) {
  const document = textEditor.document;

  if (document.languageId !== 'nextbasic') {
    return;
  }

  try {
    const selection = textEditor.selection;
    const line = selection.start.line;
    const endCh = selection.end.character;
    const source = document.getText();
    let text = document.lineAt(line).text;

    const autoline = source.split('\n').find((_) => _.startsWith('#autoline'));

    if (autoline) {
      // no line map
      return moveLines(textEditor, editor, forward);
    }

    const lineNumber = parseInt(text.trim().split(' ').shift(), 10);

    text = shift(source, lineNumber, forward > 0);

    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const range = new vscode.Range(firstLine.range.start, lastLine.range.end);

    textEditor
      .edit((editor) => {
        editor.replace(range, text);
      })
      .then(() => {
        const pos = new vscode.Position(line + forward, endCh);

        textEditor.selections = [new vscode.Selection(pos, pos)];
      });
  } catch (e) {
    console.log(e);
  }
}

// https://github.com/compulim/vscode-swapline/blob/master/extension.js
function moveLines(textEditor, edit, direction) {
  const selections = textEditor.selections,
    newSelections = [],
    directionDown = direction > 0;

  const edits = selections.map((selection) => {
    const startLine = selection.start.line,
      endLine = Math.max(startLine + 1, selection.end.line),
      lineRange = new vscode.Range(startLine, 0, endLine, 0),
      text = textEditor.document.getText(lineRange),
      lineNumberToSwap = directionDown ? endLine : startLine - 1,
      lineToSwap = textEditor.document.getText(
        new vscode.Range(lineNumberToSwap, 0, lineNumberToSwap + 1, 0)
      );

    const active = selection.active,
      anchor = selection.anchor;

    newSelections.push(
      new vscode.Selection(
        anchor.line + direction,
        anchor.character,
        active.line + direction,
        active.character
      )
    );

    return {
      range: new vscode.Range(
        directionDown ? startLine : startLine - 1,
        0,
        directionDown ? endLine + 1 : endLine,
        0
      ),
      text: directionDown ? lineToSwap + text : text + lineToSwap,
    };
  });

  textEditor
    .edit((editor) => {
      edits.map((e) => {
        editor.replace(e.range, e.text);
      });
    })
    .then(() => {
      textEditor.selections = newSelections;
    });
}
