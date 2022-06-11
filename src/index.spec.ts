import fs from 'fs';
import { HclUtils } from './index';

describe('hcl utils,', () => {
  const hclUtils = new HclUtils();
  const tfFiles = ['arr.tf', 'comments.tf', 'eof.tf', 'math.tf', 'methods.tf', 'other.tf', 'strings.tf'];
  describe.each(tfFiles)('when running on file %s,', (fileName) => {
    const inputTfFile = fs.readFileSync(`./src/test-sample-data/${fileName}`).toString();
    let parsed: any;

    it('does parsing correctly', () => {
      parsed = hclUtils.parse(inputTfFile);
      expect(parsed).toMatchSnapshot();
    });

    it('builds back an identical file', () => {
      const outputTfFile = hclUtils.compose(parsed);
      expect(outputTfFile).toEqual(inputTfFile);
    });
  });
});
