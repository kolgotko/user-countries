import { CountryInterface } from './country.interface';
import { UserInterface } from './user.interface';

export interface SearchResultInterface {
  userCountryId: number;
  country: CountryInterface;
  user: UserInterface;
  visited: boolean;
  hasVisa: boolean;
}
