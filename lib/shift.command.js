const vscode = require('vscode');
const { shift } = require('txt2bas');
const isAutoLine = require('./is-autoline');
module.exports = main;

function hook() {
  console.log('hooking shift', isAutoLine(vscode.window.document));

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
  let handlers = [];
  let autoLine = false;
  const checkHooking = () => {
    const document = vscode.window.activeTextEditor.document;
    if (document.languageId !== 'nextbasic') {
      handlers.forEach((h) => h.dispose()); // dispose
    } else {
      autoLine = isAutoLine(document);

      if (!autoLine) {
        handlers = hook();
      }
    }
  };

  // TODO check if doc changed to autoline, then unhook
  // vscode.workspace.onDidChangeTextDocument();

  if (vscode.window.activeTextEditor) {
    checkHooking();
  }

  vscode.window.onDidChangeActiveTextEditor(checkHooking);
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
