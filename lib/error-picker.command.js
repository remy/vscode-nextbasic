const { formatText } = require('txt2bas');
const vscode = require('vscode');
const errors = require('../errors.json');

module.exports = errorPicker;

const keys = new Set();
errors.forEach((e) => keys.add(e.code.toString()));
errors.forEach((e) => keys.add(e.number.toString()));

const channel = vscode.window.createOutputChannel('NextBASIC');

function errorPicker() {
  return vscode.commands.registerTextEditorCommand(
    'nextbasic.error-picker',
    async () => {
      let selection = await vscode.window.showInputBox({
        prompt: 'Display error code information',
        placeHolder: 'Numerical value OR case sensitive code',
      });
      if (!selection) return;
      selection = selection.toUpperCase().trim();

      if (/[A-Z]/.test(selection)) {
        selection = selection.charCodeAt(0) - 55;
      } else {
        selection = parseInt(selection, 10);
      }

      channel.clear();

      const selectedErrors = errors.filter((_) => _.number === selection);
      console.log(selection);
      const res = selectedErrors.map(async (e) => {
        channel.appendLine(`# ${e.report}`);
        channel.appendLine('');
        channel.appendLine(formatTextWrap(e.description, 60));
        channel.appendLine('');
        channel.appendLine(formatTextWrap(`Situation: ${e.situation}`, 60));
        channel.appendLine('');
        channel.appendLine('');
      });

      channel.show();

      return Promise.all(res)
        .catch((e) => console.log(e))
        .then(() => console.log('done'));
    }
  );
}

const formatTextWrap = (text, maxLineLength) => {
  const words = text.replace(/[\r\n]+/g, ' ').split(' ');
  let lineLength = 0;

  // use functional reduce, instead of for loop
  return words.reduce((result, word) => {
    if (lineLength + word.length >= maxLineLength) {
      lineLength = word.length;
      return result + `\n${word}`; // don't add spaces upfront
    } else {
      lineLength += word.length + (result ? 1 : 0);
      return result ? result + ` ${word}` : `${word}`; // add space only when needed
    }
  }, '');
};
