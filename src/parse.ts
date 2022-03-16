import { Token } from 'moo';

export const parseTokens = (tokens: Token[]): any => {
  let tokenNo = -1;

  const parseNext = (result: any) => {
    let token = tokens[++tokenNo];

    if (isTokenParsable(tokens, tokenNo)) {
      if (token.type === 'newLine') {
        result[`_blank_line#${token.line}`] = '';
      } else if (token.type === 'comment') {
        result[`_comment#${token.line}`] = token.value;
      } else if (token.type === '}' || token.type === ']') {
        token.type === ']' && result['_bracketLines']!.push(token.line);
        return result;
      } else if (Array.isArray(result)) {
        if (token.type === 'textBlock') {
          (result as any)['_itemLines'] = ((result as any)['_itemLines'] || []).concat(token.line);
          result.push(token.value);
        } else if (token.type === '{') {
          result.push(parseNext({}));
        }
      } else if (typeof result === 'object') {
        const keyArr = [];
        while (token.type === 'textBlock' || token.type === 'space') {
          token.type === 'textBlock' && keyArr.push(token.value);
          token = tokens[++tokenNo];
        }
        const key = buildKey(keyArr, result, token.line);

        if (token.type === '=') {
          saveKeyInfo(result, key);
          ++tokenNo;
          token = tokens[++tokenNo];

          token.type === 'textBlock' && (result[key] = token.value);
          if (token.type === '[') {
            const container: any = [];
            container['_bracketLines'] = [token.line];
            result[key] = parseNext(container);
          }
          token.type === '{' && (result[key] = parseNext({}));
        } else if (token.type === '{') {
          result[key] = parseNext({});
        }
      }
    }

    if (token) {
      parseNext(result);
    }
    return result;
  };

  return parseNext({});
};

const parsableTokens = ['textBlock', '{', '}', '[', ']', 'comment'];
const isTokenParsable = (tokens: Token[], tokenNo: number): boolean => {
  const token = tokens[tokenNo];
  return token && (parsableTokens.includes(token.type as string) || isBlankLine(tokens, tokenNo));
};

const isBlankLine = (tokens: Token[], tokenNo: number): boolean =>
  tokens[tokenNo].type === 'newLine' &&
  ((tokens[tokenNo - 1].line < tokens[tokenNo].line && tokens[tokenNo].line < tokens[tokenNo + 1].line) ||
    tokens[tokenNo + 1] === undefined);

const buildKey = (keyArr: string[], result: any, line: number): string => {
  const key = keyArr.join(' ');
  if (!result[key]) {
    return key;
  }
  return `${key}#${line}`;
};

const saveKeyInfo = (result: any, key: string): void => {
  if (result._withEqualsSign) {
    result._withEqualsSign.push(key);
  } else {
    result._withEqualsSign = [key];
  }
};
