import { Arr } from './types';

export const composeOutput = (parsedResult: any): string => {
  let tfFile = '';
  Object.entries(parsedResult).forEach(([key, value]) => {
    if (key !== '_withEqualsSign') {
      if (typeof value === 'string') {
        if (key.startsWith('_blank_line')) {
          tfFile += '\n';
        } else if (key.startsWith('_comment')) {
          tfFile += `${value}\n`;
        } else {
          tfFile += `${key} = ${value}\n`;
        }
      } else if (Array.isArray(value)) {
        tfFile += `${key} = [${composeArray(value as unknown as Arr)}]\n`;
      } else {
        key = key.split('#')[0];
        const content = Object.entries(value as Object).length ? `\n${composeOutput(value)}` : '';
        tfFile += `${key} {${content}}\n`;
      }
    }
  });
  return tfFile;
};

const composeArray = (value: Arr): string => {
  const [openingBracketLineNo, closingBracketLineNo] = value._bracketLines;
  const itemLines = value._itemLines;
  const newLineOrNot1 = !itemLines || openingBracketLineNo === itemLines[0] ? '' : '\n';
  const items = value
    .map((item, idx) => {
      if (idx === 0) {
        return item;
      } else if (itemLines[idx - 1] === itemLines[idx]) {
        return `, ${item}`;
      } else {
        return `,\n${item}`;
      }
    })
    .join('');
  const newLineOrNot2 = !itemLines || closingBracketLineNo === itemLines[itemLines.length - 1] ? '' : ',\n';
  return `${newLineOrNot1}${items}${newLineOrNot2}`;
};
