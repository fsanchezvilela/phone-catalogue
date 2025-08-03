import * as fs from 'node:fs';
import { countFilePath } from '~/constants/filepath';

export async function readCount() {
  return parseInt(await fs.promises.readFile(countFilePath, 'utf-8').catch(() => '0'));
}
