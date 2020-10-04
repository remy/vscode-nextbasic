const vscode = require('vscode');
const { formatText } = require('txt2bas');

module.exports = main;

const provider = {
  async provideDocumentFormattingEdits(document) {
    try {
      let text = document.getText();
      const textEditor = vscode.window.activeTextEditor;
      // const autoline = text.split('\n').find((_) => _.startsWith('#autoline'));

      await textEditor.edit((editor) => {
        try {
          text
            .replace(/\r/g, '')
            .split('\n')
            .forEach((line, i) => {
              const text = formatText(line, true);
              const start = new vscode.Position(i, 0);
              const end = new vscode.Position(i, line.length);
              editor.replace(new vscode.Range(start, end), text);
            });
        } catch (e) {}
      });
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
