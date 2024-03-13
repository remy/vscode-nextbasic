const vscode = require('vscode');
const isAutoLine = require('./is-autoline');

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

      const autoLine = isAutoLine(document, selection);

      // base commenting action on first line
      const snip = document.lineAt(selection.start.line).text;
      let commentAction = 0; // 0 = add
      let snipLead = snip.replace(/^\d*/, ''); // remove the line number
      const whitespace = autoLine ? '' : (snipLead.match(/(\s+)/) || [, ''])[1];
      snipLead = snipLead.trim();

      if (snipLead.startsWith('REM ') || snipLead.startsWith(';')) {
        commentAction = 1; // 1 = remove
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
          if (autoLine) {
            rest = num + ' ' + rest;
            num = '';
          }
          if (commentAction === 0) {
            rest = ' ' + rest;
          }
          editBuilder.delete(new vscode.Range(start, end));
          if (commentAction === 0) {
            editBuilder.insert(
              start,
              `${num}${whitespace}${commentWith}${rest}`
            );
          } else if (commentAction === 1) {
            editBuilder.insert(
              start,
              `${num}${whitespace}${rest.replace(
                /^\s*(;\s{0,1}|REM\s{0,1})/,
                ''
              )}`
            );
          }
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  });
}
