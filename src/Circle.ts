import { parse } from 'node-html-parser';

import { getFormHtml } from './Common';
import type { ICircle } from './types';

export async function fetchCircles(): Promise<ICircle[]> {
  const html = await getFormHtml();

  const dom = parse(html);

  const options = dom.querySelectorAll('select option');

  const circles: ICircle[] = [];

  for (const option of options) {
    if (isNaN(Number(option.attributes.value))) {
      continue;
    }

    const circle: ICircle = {
      name: option.text,
      value: option.attributes.value
    };

    circles.push(circle);
  }

  return circles;
}
