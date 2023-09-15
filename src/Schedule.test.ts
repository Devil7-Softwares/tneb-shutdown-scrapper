import { existsSync, readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

import { resolveCaptcha } from './Schedule';

const files: Array<{ filename: string; file: Buffer }> = readdirSync(
  resolve(process.cwd(), 'sample-captchas')
).map((filename) => ({
  filename,
  file: readFileSync(resolve(process.cwd(), 'sample-captchas', filename))
}));

// If training data exists, we can use the default timeout of 5 seconds otherwise may need to wait for 60 seconds
const trainingDataExists = existsSync(
  resolve(process.cwd(), 'eng.traineddata')
);

describe('resolveCaptcha', () => {
  test.each(files)(
    'Should resolve $filename',
    async ({ filename, file }) => {
      const result = await resolveCaptcha(file);

      expect(result).toBe(filename.split('.')[0]);
    },
    trainingDataExists ? 5000 : 60000
  );
});
