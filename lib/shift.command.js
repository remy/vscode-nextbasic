const vscode = require('vscode');
const { shift } = require('txt2bas');
module.exports = main;

function hook() {
  return [
    vscode.commands.registerTextEditorCommand(
      'editor.action.moveLinesUpAction',
      (textEditor) => shiftUp(textEditor, false)
    ),
    vscode.commands.registerTextEditorCommand(
      'editor.action.moveLinesDownAction',
      (textEditor) => shiftUp(textEditor, true)
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

async function shiftUp(textEditor, forward) {
  const document = textEditor.document;

  if (document.languageId !== 'nextbasic') {
    return;
  }

  try {
    const line = textEditor.selection.start.line;
    const endCh = textEditor.selection.end.character;
    let text = document.lineAt(line).text;
    const source = document.getText();
    const lineNumber = parseInt(text.trim().split(' ').shift(), 10);

    text = shift(source, lineNumber, forward);

    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const range = new vscode.Range(firstLine.range.start, lastLine.range.end);

    textEditor
      .edit((editor) => {
        editor.replace(range, text);
      })
      .then(() => {
        const pos = new vscode.Position(line + (forward ? 1 : -1), endCh);

        textEditor.selections = [new vscode.Selection(pos, pos)];
      });
  } catch (e) {
    console.log(e);
  }
}
