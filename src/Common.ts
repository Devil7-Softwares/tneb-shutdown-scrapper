import axios from 'axios';

import { TNEB_FORM_URL } from './Constants';

axios.interceptors.response.use((response) => {
  if (response.headers !== undefined) {
    const cookie = response.headers['set-cookie'];

    if (Array.isArray(cookie) && cookie.length > 0) {
      const cookieValue = cookie[0].split(';')[0];
      (axios.defaults.headers.get as unknown as Record<string, string>).Cookie =
        cookieValue;
      (
        axios.defaults.headers.post as unknown as Record<string, string>
      ).Cookie = cookieValue;
    }
  }

  return response;
});

export const getFormHtml = async (): Promise<string> => {
  const response = await axios.get<string>(TNEB_FORM_URL, {
    withCredentials: true
  });

  return response.data;
};
