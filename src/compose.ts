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
  const firstItemLineNo = Array.isArray(itemLines[0]) ? itemLines[0][0] : itemLines[0];
  const newLineOrNot1 = !itemLines.length || openingBracketLineNo === firstItemLineNo ? '' : '\n';
  const items = value
    .map((item, idx) => {
      if (idx === 0) {
        return item;
      } else {
        const prevLineNo = Array.isArray(itemLines[idx - 1]) ? (itemLines[idx - 1] as any)[1] : itemLines[idx - 1];
        const currLineNo = Array.isArray(itemLines[idx]) ? (itemLines[idx] as any)[0] : itemLines[idx];
        const newLineOrNot = prevLineNo === currLineNo ? ' ' : '\n';
        return `,${newLineOrNot}${item}`;
      }
    })
    .join('');
  const lastItemLineNo = Array.isArray(itemLines[itemLines.length - 1]) ? (itemLines[itemLines.length - 1] as any)[1] : itemLines[itemLines.length - 1];
  const newLineOrNot2 = !itemLines.length || closingBracketLineNo === lastItemLineNo ? '' : ',\n';
  return `${newLineOrNot1}${items}${newLineOrNot2}`;
};
