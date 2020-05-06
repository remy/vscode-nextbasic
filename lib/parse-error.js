const vscode = require('vscode');

module.exports = function parseError(text) {
  text = text.split('\n')[0];
  const matches = text.match(/^(.*?)(?: at: (\d+):(\d+))?#(\d+)/);
  if (!matches) {
    console.error(`Failed to parse "${text}"`);
    return null;
  }

  matches.shift(); // full match
  const message = matches.shift();
  const line = matches.pop() - 1;
  let start = 0;
  let end = vscode.window.activeTextEditor.document.lineAt(line).text.length;
  if (matches.filter(Boolean).length) {
    start = matches.shift() - 1;
    end = matches.shift() - 1;
  }

  return { message, start, end, line };
};
