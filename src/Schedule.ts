import Tesseract from 'tesseract.js';

export const resolveCaptcha = async (image: Buffer): Promise<string> => {
  const result = await Tesseract.recognize(image, 'eng');

  return result.data.text.trim();
};
