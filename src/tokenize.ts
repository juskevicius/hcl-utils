import moo from 'moo';

export const tokenize = (input: string): moo.Token[] => {
  const anyChars = `[\\s\\S]*?`;

  const eof = `<<EOF${anyChars}EOF`; //e.g.: <<EOF content EOF
  const otherText = `[a-zA-Z-_./*\\[\\]\\d]+`; //e.g.: aws.super_resource.id, locals, etc
  const digits = `[\\d]+`;
  const textBlockRegex = new RegExp(`${eof}|${otherText}|${digits}`);

  const regularComment = `^\\s*(?:\\/\\/|#)${anyChars}(?=\\n)`; //e.g.: # comment, // comment
  const multilineComment = `^\\/\\*${anyChars}\\*\\/`; //e.g.: /* multiline \n comment */
  const commentRegex = new RegExp(`${regularComment}|${multilineComment}`);

  const tokenizer = moo.compile({
    comment: commentRegex,
    '{': '{',
    '}': '}',
    '[': '[',
    ']': ']',
    '(': '(',
    ')': ')',
    operator: /[ ]+[?=+*-\\/]+ /,
    '"': '"',
    "'": "'",
    stringInterpolation: '${',
    textBlock: textBlockRegex,
    comma: ',',
    space: /[ \t]+/,
    newLine: { match: '\n', lineBreaks: true },
  });

  tokenizer.reset(input);

  return Array.from(tokenizer);
};
