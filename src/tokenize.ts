import moo from 'moo';

export const tokenize = (input: string): moo.Token[] => {
  const anyChars = `[\\s\\S]*?`;

  const arithmeticOperation = `(?<=\\=\\s)[\\S]*\\s[+*-\\/]\\s[\\S]*(?=\\n)`; //e.g.: length(var.a) * var.b
  const methodName = `[a-zA-Z\\d]+`;
  const methodCall = `${methodName}\\(${anyChars}\\)+`; //e.g.: method(params)
  const stringInterpolation = `\\$\\{${anyChars}\\}`;
  const quotedString = `"(?:(?:${anyChars}(?!\\{))(?:${stringInterpolation})*)*?"`; //e.g.: "quoted text with or without ${string interpolation}"
  const eof = `<<EOF${anyChars}EOF`; //e.g.: <<EOF content EOF
  const otherText = `[a-zA-Z][a-zA-Z*-_.\\[\\]\\d]+`; //e.g.: aws.super_resource.id, locals, etc
  const digits = `[\\d]+`;
  const textBlockRegex = new RegExp(`${arithmeticOperation}|${methodCall}|${quotedString}|${eof}|${otherText}|${digits}`);

  const regularComment = `^\\s*(?:\\/\\/|#)${anyChars}(?=\\n)`; //e.g.: # comment, // comment
  const multilineComment = `^\\/\\*${anyChars}\\*\\/`; //e.g.: /* multiline \n comment */
  const commentRegex = new RegExp(`${regularComment}|${multilineComment}`);

  const tokenizer = moo.compile({
    textBlock: textBlockRegex,
    comment: commentRegex,
    '{': '{',
    '}': '}',
    '[': '[',
    ']': ']',
    '=': '=',
    comma: ',',
    space: /[ \t]+/,
    newLine: { match: '\n', lineBreaks: true },
  });

  tokenizer.reset(input);

  return Array.from(tokenizer);
};
