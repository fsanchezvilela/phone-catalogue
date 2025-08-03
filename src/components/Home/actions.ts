import { createServerFn } from '@tanstack/react-start';
import { countFilePath } from '~/constants/filepath';
import { readCount } from '~/utils/server';
import * as fs from 'node:fs';

export const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(countFilePath, `${count + data}`);
  });
