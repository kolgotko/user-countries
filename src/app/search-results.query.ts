import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { SearchResultsState, SearchResultsStore } from './search-results.store';
import { SearchResult } from './models/search-result.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsQuery extends
  QueryEntity<SearchResultsState, SearchResult> {

  results$ = this.selectAll();
  loading$ = this.selectLoading();

  constructor( protected store: SearchResultsStore ) {
    super(store);
  }

}
