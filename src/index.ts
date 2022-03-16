import { execSync } from 'child_process';
import fs from 'fs';
import { composeOutput } from './compose';
import { parseTokens } from './parse';
import { tokenize } from './tokenize';
import { Options } from './types';

export class HclUtils {
  options: Options | undefined;

  constructor(options?: Options) {
    this.options = options;
  }

  public parse(input: string): void {
    const mooTokens = tokenize(input);
    return parseTokens(mooTokens);
  }

  public compose(parsed: any): string {
    const output = composeOutput(parsed).slice(0, -1);
    return this.options?.formatOutput === false ? output : this.format(output);
  }

  private format(raw: string): string {
    const filePath = `${__dirname}/output.tf`;
    let formatted;
    try {
      fs.writeFileSync(filePath, raw);
      execSync(`terraform fmt ${filePath}`);
      formatted = fs.readFileSync(filePath).toString();
    } catch (exception) {
      console.error(exception);
    } finally {
      fs.unlinkSync(filePath);
    }
    return formatted || raw;
  }
}
