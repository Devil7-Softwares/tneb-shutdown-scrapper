import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import FormData from 'form-data';
import parse from 'node-html-parser';
import Tesseract from 'tesseract.js';

import { getFormHtml } from './Common';
import { TIMEZONE, TNEB_CAPTCHA_URL, TNEB_FORM_URL } from './Constants';
import type { ISchedule } from './types';

dayjs.extend(customParseFormat);
dayjs.extend(tz);
dayjs.extend(utc);

export const resolveCaptcha = async (image: Buffer): Promise<string> => {
  const result = await Tesseract.recognize(image, 'eng');

  return result.data.text.trim();
};

export const getCaptchaValue = async (): Promise<string> => {
  const response = await axios.get<Buffer>(TNEB_CAPTCHA_URL, {
    responseType: 'arraybuffer',
    withCredentials: true
  });

  return await resolveCaptcha(response.data);
};

export const getViewState = async (): Promise<{
  id: string;
  state: string;
}> => {
  const html = await getFormHtml();

  const dom = parse(html);

  const formElement = dom.querySelector('form');
  const viewStateElement = dom.querySelector(
    '#j_id1\\:javax\\.faces\\.ViewState\\:0'
  );

  if (formElement === null) {
    throw new Error('Unable to find form');
  }

  if (viewStateElement === null) {
    throw new Error('Unable to find view state');
  }

  const id = formElement.getAttribute('id');
  const state = viewStateElement.getAttribute('value');

  if (id === undefined || id === '') {
    throw new Error('Unable to find form id');
  }

  if (state === undefined || state === '') {
    throw new Error('Unable to find view state value');
  }

  return { id, state };
};

export const fetchSchedule = async (circleId: string): Promise<ISchedule[]> => {
  const { id, state } = await getViewState();
  const captcha = await getCaptchaValue();
  const data = new FormData();

  data.append(id, id);
  data.append(`${id}:appcat_focus`, '');
  data.append(`${id}:appcat_input`, circleId);
  data.append(`${id}:cap`, captcha);
  data.append(`${id}:submit3`, '');
  data.append('javax.faces.ViewState', state);

  const response = await axios.post<string>(TNEB_FORM_URL, data, {
    withCredentials: true
  });

  const rowElements = parse(response.data).querySelectorAll('table tbody tr');

  const rows = rowElements.map((rowElement) => {
    const columns = rowElement.querySelectorAll('td');

    const schedule: ISchedule = {
      date: dayjs.tz(columns[0].text.trim(), 'DD-MM-YYYY', TIMEZONE).toDate(),
      town: columns[1].text.trim(),
      subStation: columns[2].text.trim(),
      feeder: columns[3].text.trim(),
      location: columns[4].text.trim(),
      typeOfWork: columns[5].text.trim(),
      from: dayjs
        .tz(`${columns[6].text.trim()} AM`, 'DD-MM-YYYY hh:mm A', TIMEZONE)
        .toDate(),
      to: dayjs
        .tz(`${columns[7].text.trim()} PM`, 'DD-MM-YYYY hh:mm A', TIMEZONE)
        .toDate()
    };

    return schedule;
  });

  return rows;
};
