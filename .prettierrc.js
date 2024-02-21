/** @type {import('prettier').Config} */
module.exports = {
  /** Compatible with Windows */
  endOfLine: 'lf',
  /** The number of characters per line. If exceeded, a newline will be inserted. */
  printWidth: 180,
  /** The number of spaces per tab. */
  tabWidth: 2,
  /** Whether to use tabs for indentation. */
  useTabs: false,
  /** Whether to use single quotes for strings. */
  singleQuote: true,
  /** Whether to use semicolons at the end of lines. */
  semi: false,
  /** Whether to use trailing commas. */
  trailingComma: 'es5',
  /** Whether to have spaces inside object braces. */
  bracketSpacing: true,
}
