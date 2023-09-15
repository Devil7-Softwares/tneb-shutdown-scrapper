import axios from 'axios';
import { parse } from 'node-html-parser';

import { TNEB_FORM_URL } from './Constants';
import type { ICircle } from './types';

export async function getCircleData(): Promise<ICircle[]> {
  const response = await axios.get(TNEB_FORM_URL);

  const dom = parse(response.data);

  const options = dom.querySelectorAll('#j_idt8\\:appcat_input option');

  const circles: ICircle[] = [];

  for (const option of options) {
    const circle: ICircle = {
      name: option.text,
      value: option.attributes.value
    };

    circles.push(circle);
  }

  return circles;
}
