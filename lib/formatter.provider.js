const vscode = require('vscode');
const { file2bas, file2txt } = require('txt2bas');

module.exports = main;

const provider = {
  provideDocumentFormattingEdits(document) {
    try {
      let text = document.getText();

      text = file2txt(file2bas(text, { binary: true }));

      const firstLine = document.lineAt(0);
      const lastLine = document.lineAt(document.lineCount - 1);
      const range = new vscode.Range(firstLine.range.start, lastLine.range.end);

      return [vscode.TextEdit.replace(range, text)];
    } catch (e) {
      console.log(e);
    }
  },
};

function main() {
  const language = ['nextbasic'];
  return [
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      language,
      provider
    ),
    vscode.languages.registerDocumentFormattingEditProvider(language, provider),
  ];
}
