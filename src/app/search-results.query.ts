import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { SearchResultsState, SearchResultsStore } from './search-results.store';
import { SearchResultInterface } from './interfaces/search-result.interface';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsQuery extends
  QueryEntity<SearchResultsState, SearchResultInterface> {

  results$ = this.selectAll();
  loading$ = this.selectLoading();

  constructor( protected store: SearchResultsStore ) {
    super(store);
  }

}
