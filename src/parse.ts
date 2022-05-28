import { Token } from 'moo';

export const parseTokens = (tokens: Token[]): any => {
  let tokenNo = -1;
  const nextToken = () => tokens[++tokenNo];
  const thisToken = () => tokens[tokenNo];

  const buildString = () => {
    const stack = ['"'];
    let text = '"';
    const lines = [thisToken().line];
    while (stack.length) {
      const token = nextToken();
      if (token.type === 'stringInterpolation') {
        stack.push('${');
      } else if (token.type === '}') {
        stack.pop();
      } else if (token.type === '"') {
        if (stack[stack.length - 1] === '${') {
          stack.push('"');
        } else {
          stack.pop();
        }
      }
      text += token.value;
    }
    lines.push(thisToken().line)
    
    return { text, lines };
  };

  const buildArray = (token: Token) => {
    const container: any = [];
    container['_bracketLines'] = [token.line];
    container['_itemLines'] = [];
    parseNext(container);
    return container;
  };

  const buildObject = () => {
    const container: any = {};
    container['_withEqualsSign'] = [];
    parseNext(container);
    return container;
  };

  const buildKey = (result: any) => {
    let keyStr = '';
    let token = thisToken();
    while (token.type === 'textBlock' || token.type === 'space' || token.type === '"') {
      keyStr += token.value;
      token = nextToken();
    }
    keyStr = keyStr.trim();
    return !result[keyStr] ? keyStr : `${keyStr}#${token.line}`;
  };

  const parseNext = (result: any): any => {
    let token = nextToken();

    if (isTokenParsable(tokens, tokenNo)) {
      if (token.type === 'newLine') {
        result[`_blank_line#${token.line}`] = '';
      } else if (token.type === 'comment') {
        result[`_comment#${token.line}`] = token.value;
      } else if (token.type === '}' || token.type === ']') {
        token.type === ']' && result['_bracketLines']!.push(token.line);
        return result;
      } else {
        if (Array.isArray(result)) {
          if (token.type === 'textBlock') {
            (result as any)['_itemLines'].push(token.line);
            result.push(token.value);
          } else if (token.type === '{') {
            result.push(buildObject());
          } else if (token.type === '"') {
            const { text, lines } = buildString();
            (result as any)['_itemLines'].push(lines);
            result.push(text);
          }
        } else if (typeof result === 'object') {
          const key = buildKey(result);

          token = thisToken();
          if (token.value === ' = ') {
            result._withEqualsSign.push(key);
            token = nextToken();

            if (token.type === 'textBlock') {
              result[key] = token.value;
            } else if (token.type === '"') {
              result[key] = buildString().text;
            } else if (token.type === '[') {
              result[key] = buildArray(token);
            } else if (token.type === '{') {
              result[key] = buildObject();
            }
          } else if (token.type === '{') {
            result[key] = buildObject();
          }
        }
      }
    }

    if (token) {
      parseNext(result);
    }
  };


  return buildObject();
};

// const parsableTokens = ['textBlock', '{', '}', '[', ']', 'comment'];
const isTokenParsable = (tokens: Token[], tokenNo: number): boolean => {
  const token = tokens[tokenNo];
  if (token) {
    if (token.type === 'newLine') {
      return isBlankLine(tokens, tokenNo);
    }
    return token.type !== 'space';
  }
  return false;
};

const isBlankLine = (tokens: Token[], tokenNo: number): boolean =>
  (tokens[tokenNo - 1].line < tokens[tokenNo].line && tokens[tokenNo].line < tokens[tokenNo + 1].line) ||
  tokens[tokenNo + 1] === undefined;
