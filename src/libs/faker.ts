import faker from 'faker';
import { FakerAvailableLocales } from '../models/faker.model';

/**
 * Set the Faker locale
 *
 * @param locale
 */
export const SetFakerLocale = (locale: FakerAvailableLocales) => {
  faker.locale = locale;
};

/**
 * Set the Faker seed
 *
 * @param seed
 */
export const SetFakerSeed = (seed: number) => {
  faker.seed(seed);
};
