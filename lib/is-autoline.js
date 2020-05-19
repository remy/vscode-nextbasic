module.exports = function isAutoLine(document) {
  // shouldn't be required, but just in case
  if (!document || !document.getText) return false;

  const lines = document
    .getText()
    .split('\n')
    .filter((_) => !!_.trim());
  const firstNonDirective = lines.findIndex((_) => !_.startsWith('#'));
  const autoLine = lines.findIndex((_) => _.startsWith('#autoline'));

  if (autoLine > -1 && autoLine < firstNonDirective) {
    return true;
  }
};
