import { ID, guid } from '@datorama/akita';
import { CountryInterface } from '../interfaces/country.interface';
import { UserInterface } from '../interfaces/user.interface';

export interface SearchResult {
  id: ID;
  userCountryId: number;
  country: CountryInterface;
  user: UserInterface;
  visited: boolean;
  hasVisa: boolean;
}

export function createSearchResult(data: Partial<SearchResult>) {

  return {
    id: guid(),
    userCountryId: 0,
    visited: false,
    hasVisa: false,
    ...data,
  } as SearchResult;

}
