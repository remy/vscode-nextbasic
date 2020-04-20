const vscode = require('vscode');

module.exports = main;

function main() {
  return vscode.commands.registerCommand('nextbasic.commentLine', () => {
    if (vscode.window.activeTextEditor.document.languageId !== 'nextbasic') {
      return;
    }
    try {
      const { commentWith } = vscode.workspace.getConfiguration('nextbasic');
      const editor = vscode.window.activeTextEditor;
      const document = editor.document;
      const selection = editor.selection;
      const nLines = selection.end.line - selection.start.line + 1;

      // base commenting action on first line
      const snip = document.lineAt(selection.start.line).text;
      let commentAction = 0;
      const snipLead = snip.replace(/^\d+\s*/, ''); // remove the line number
      if (snipLead.startsWith('REM ') || snipLead.startsWith(';')) {
        commentAction = 1;
      }

      // toggle the line
      editor.edit((editBuilder) => {
        for (let i = 0; i < nLines; i++) {
          const lineNum = selection.start.line + i;
          const line = document.lineAt(lineNum).text;

          const start = new vscode.Position(lineNum, 0);
          const end = new vscode.Position(lineNum, line.length);

          // decide whether to remove or add
          let [num, ...rest] = line.split(' ');
          rest = rest.join(' ');
          editBuilder.delete(new vscode.Range(start, end));
          if (commentAction === 0) {
            editBuilder.insert(start, `${num} ${commentWith} ${rest}`);
          } else if (commentAction === 1) {
            editBuilder.insert(
              start,
              `${num} ${rest.replace(/^\s*(;|REM)\s*/, '')}`
            );
          }
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  });
}
