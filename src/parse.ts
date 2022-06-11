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
    container['_formatting'] = {
      bracketLines: [token.line],
      itemLines: []
    }
    parseNext(container);
    return container;
  };

  const buildObject = () => {
    const container: any = {};
    container['_formatting'] = {
      withEqualsSign: []
    }
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

  const buildValue = () => {
    let token = thisToken();
    let value = '';
    do {
      if (token.type === 'textBlock') {
        value += token.value;
      } else if (token.type === '"') {
        value += buildString().text;
      } else if (token.type === '[') {
        value = buildArray(token);
      } else if (token.type === '{') {
        value = buildObject();
      } else {
        value += token.value;
      }
      token = nextToken();
    } while (token.type !== 'newLine')

    return value;
  }

  const parseNext = (result: any): any => {
    let token = nextToken();

    if (isTokenParsable(tokens, tokenNo)) {
      if (token.type === 'newLine') {
        result[`_blank_line#${token.line}`] = '';
      } else if (token.type === 'comment') {
        result[`_comment#${token.line}`] = token.value;
      } else if (token.type === '}' || token.type === ']') {
        token.type === ']' && result._formatting.bracketLines.push(token.line);
        return result;
      } else {
        if (Array.isArray(result)) {
          if (token.type === 'textBlock') {
            (result as any)._formatting.itemLines.push(token.line)
            result.push(token.value);
          } else if (token.type === '{') {
            result.push(buildObject());
          } else if (token.type === '"') {
            const { text, lines } = buildString();
            (result as any)._formatting.itemLines.push(lines)
            result.push(text);
          }
        } else if (typeof result === 'object') {
          const key = buildKey(result);
          token = thisToken();
          if (token.value.includes(' = ')) {
            result._formatting.withEqualsSign.push(key);
            token = nextToken();
            result[key] = buildValue();
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
