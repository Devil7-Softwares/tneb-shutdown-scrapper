import { existsSync, readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

import * as Common from './Common';
import { fetchSchedule, getViewState, resolveCaptcha } from './Schedule';
import type { ISchedule } from './types';

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

describe('getViewState', () => {
  let result: Awaited<ReturnType<typeof getViewState>> | undefined;

  beforeAll(async () => {
    result = await getViewState();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('Should return an object with id and state', async () => {
    expect(result).toMatchObject({
      id: expect.any(String),
      state: expect.any(String)
    });
    expect(result?.id.length).toBeGreaterThan(0);
    expect(result?.state.length).toBeGreaterThan(0);
  });

  test("Show throw an error if form can't be found", async () => {
    jest.spyOn(Common, 'getFormHtml').mockResolvedValueOnce('<html></html>');

    await expect(getViewState()).rejects.toThrow('Unable to find form');
  });

  test("Show throw an error if view state can't be found", async () => {
    jest
      .spyOn(Common, 'getFormHtml')
      .mockResolvedValueOnce('<html><form></form></html>');

    await expect(getViewState()).rejects.toThrow('Unable to find view state');
  });

  test('Show throw an error if form id is empty', async () => {
    jest
      .spyOn(Common, 'getFormHtml')
      .mockResolvedValueOnce(
        '<html><form><input id="j_id1:javax.faces.ViewState:0" /></form></html>'
      );

    await expect(getViewState()).rejects.toThrow('Unable to find form id');
  });

  test('Show throw an error if view state is empty', async () => {
    jest
      .spyOn(Common, 'getFormHtml')
      .mockResolvedValueOnce(
        '<html><form id="j_idx5"><input id="j_id1:javax.faces.ViewState:0" /></form></html>'
      );

    await expect(getViewState()).rejects.toThrow(
      'Unable to find view state value'
    );
  });
});

describe('fetchSchedule', () => {
  let schedules: ISchedule[] | undefined;

  beforeAll(async () => {
    schedules = await fetchSchedule('0402');
  });

  test('Should return an array', () => {
    expect(Array.isArray(schedules)).toBe(true);
  });

  test('Should return an array of length greater than 0', () => {
    expect(schedules?.length).toBeGreaterThan(0);
  });

  test('Should return an array of objects', () => {
    expect(typeof schedules?.[0]).toBe('object');
  });

  test('Should return an array of ISchedule objects', () => {
    for (const schedule of schedules ?? []) {
      expect(schedule).toMatchObject<ISchedule>({
        date: expect.any(Date),
        from: expect.any(Date),
        to: expect.any(Date),
        town: expect.any(String),
        location: expect.any(String),
        feeder: expect.any(String),
        subStation: expect.any(String),
        typeOfWork: expect.any(String)
      });
    }
  });
});
