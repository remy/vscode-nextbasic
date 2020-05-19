const vscode = require('vscode');
const { formatText, file2bas, file2txt } = require('txt2bas');

module.exports = main;

const provider = {
  async provideDocumentFormattingEdits(document) {
    try {
      let text = document.getText();
      const textEditor = vscode.window.activeTextEditor;
      const autoline = text.split('\n').find((_) => _.startsWith('#autoline'));

      if (autoline) {
        await textEditor.edit((editor) => {
          try {
            text.split('\n').forEach((line, i) => {
              const text = formatText(line, true);
              const start = new vscode.Position(i, 0);
              const end = new vscode.Position(i, line.length);
              editor.replace(new vscode.Range(start, end), text);
            });
          } catch (e) {}
        });
      } else {
        text = file2txt(file2bas(text, { binary: true }));

        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(document.lineCount - 1);
        const range = new vscode.Range(
          firstLine.range.start,
          lastLine.range.end
        );

        return [vscode.TextEdit.replace(range, text)];
      }
    } catch (e) {
      console.log('formatter.provider');
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
