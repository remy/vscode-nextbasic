const vscode = require('vscode');
const { renumber } = require('txt2bas');
module.exports = main;

function main() {
  return vscode.commands.registerTextEditorCommand(
    'nextbasic.renumber',
    renumberCommand
  );
}

async function renumberCommand(textEditor, editor) {
  const document = textEditor.document;

  if (document.languageId !== 'nextbasic') {
    return;
  }

  try {
    const source = document.getText();

    const selection = textEditor.selection;

    const start = selection.start;
    const end = selection.end;

    let text = source;
    if (start.line === end.line) {
      text = renumber(source);
    } else {
      const startLineNumber = parseInt(
        document.lineAt(start.line).text.trim().split(' '),
        10
      );
      const endLineNumber = parseInt(
        document.lineAt(end.line).text.trim().split(' '),
        10
      );

      console.log({ startLineNumber, endLineNumber });

      try {
        text = renumber(source, { start: startLineNumber, end: endLineNumber });
      } catch (e) {
        if (e.message.toLowerCase().includes('no room')) {
          vscode.window.showErrorMessage(
            `No room for new line - renumber increments by 10 and there wasn't room beyond line 9999`
          );
          return;
        }
      }
    }

    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const range = new vscode.Range(firstLine.range.start, lastLine.range.end);

    editor.replace(range, text);
  } catch (e) {
    console.log(e);
  }
}
