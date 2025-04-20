const vscode = require('vscode');
const { formatText } = require('txt2bas');

module.exports = main;

const provider = {
  async provideDocumentFormattingEdits(document) {
    try {
      const text = document.getText().replace(/\r/g, '');
      const edits = [];

      text.split('\n').forEach((line, i) => {
        const formatted = formatText(line, true);
        const start = new vscode.Position(i, 0);
        const end = new vscode.Position(i, line.length);
        const range = new vscode.Range(start, end);
        edits.push(vscode.TextEdit.replace(range, formatted));
      });

      return edits;
    } catch (e) {
      console.log('formatter.provider');
      console.log(e);
      return [];
    }
  },
};

function main() {
  const language = 'nextbasic';
  return [
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      language,
      provider
    ),
    vscode.languages.registerDocumentFormattingEditProvider(language, provider),
  ];
}
