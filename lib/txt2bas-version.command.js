const vscode = require('vscode');
const { version } = require('txt2bas');

console.log(version);

module.exports = main;

function main() {
  return vscode.commands.registerTextEditorCommand(
    'nextbasic.txt2basVersion',
    () =>
      vscode.window.showInformationMessage(
        'Current txt2bas version: v' + version
      )
  );
}
