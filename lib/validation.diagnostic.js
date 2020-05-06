const vscode = require('vscode');
const { validateTxt } = require('txt2bas');
const debounce = require('lodash.debounce');
const parseError = require('./parse-error');
module.exports = main;

function main() {
  const diagnosticCollection = vscode.languages.createDiagnosticCollection(
    'nextbasic'
  );

  const checkForErrors = debounce(
    () => {
      console.log('changed');
      diagnosticCollection.clear();

      const document = vscode.window.activeTextEditor.document;
      let uri = document.uri;

      const errors = validateTxt(document.getText());

      if (!errors.length) {
        return;
      }

      const diagnostics = [];
      errors.forEach((line) => {
        const error = parseError(line);
        let range = new vscode.Range(
          error.line,
          error.start,
          error.line,
          error.end || document.lineAt(error.line).text.length
        );
        diagnostics.push(new vscode.Diagnostic(range, error.message));
      });

      diagnosticCollection.set(uri, diagnostics);
    },
    100,
    { leading: true }
  );

  vscode.workspace.onDidChangeTextDocument(checkForErrors);
  vscode.window.onDidChangeActiveTextEditor(checkForErrors);

  if (vscode.window.activeTextEditor) {
    checkForErrors();
  }

  return diagnosticCollection;
}
