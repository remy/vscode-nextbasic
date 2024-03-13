module.exports = function isAutoLine(document, selection) {
  // shouldn't be required, but just in case
  if (!document || !document.getText) return false;

  const lines = document.getText().split('\n');

  const currentLine = selection.start.line + 1;

  // search upwards to see what autoline mode we might be in
  let inAutoLine = false;
  for (let i = currentLine - 1; i >= 0; i--) {
    if (lines[i].startsWith('#autoline')) {
      inAutoLine = /#autoline \d+/.test(lines[i]);
      break;
    }
  }

  return inAutoLine;
};
