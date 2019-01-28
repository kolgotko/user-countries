import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UsersService } from '../users.service';
import { CountriesService } from '../countries.service';
import { UserInterface } from '../interfaces/user.interface';
import { CountryInterface } from '../interfaces/country.interface';
import { UsersQuery } from '../users.query';
import { CountriesQuery } from '../countries.query';
import { UserCountriesService } from '../user-countries.service';
import { UserCountriesQuery } from '../user-countries.query';
import { UserCountryInterface } from '../interfaces/user-coutry.interface';
import { SearchResult, createSearchResult } from '../models/search-result.model';
import { Observable, of, from, combineLatest, zip  } from 'rxjs';
import { switchMap, map, pluck, tap, first, finalize } from 'rxjs/operators';

import { SearchResultsQuery } from '../search-results.query';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-user-countries',
  templateUrl: './user-countries.component.html',
  styleUrls: ['./user-countries.component.scss']
})
export class UserCountriesComponent implements OnInit, OnDestroy {

  users$: Observable<UserInterface[]>;
  countries$: Observable<CountryInterface[]>;
  userCountries$: Observable<UserCountryInterface[]>;
  searchForm: FormGroup;
  searchResult: SearchResult[] = [];
  searchResultForm: FormGroup;
  searchResults$: Observable<SearchResult[]>;
  resultsLoading$: Observable<boolean>;
  displayedColumns = ['user', 'country', 'visited', 'hasVisa'];
  isLockedResultsForm = false;

  readonly binOptions = {
    'any': new Set([true, false]),
    'yes': new Set([true]),
    'no': new Set([false]),
  };

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private countriesService: CountriesService,
    private usersQuery: UsersQuery,
    private countriesQuery: CountriesQuery,
    private userCountriesService: UserCountriesService,
    private userCountriesQuery: UserCountriesQuery,
    private searchResultsQuery: SearchResultsQuery,
    private searchService: SearchService,
  ) { }

  ngOnInit() {

    this.loadCountries();
    this.loadUsers();
    this.loadUserCoutries();

    this.users$ = this.usersQuery.users$;
    this.countries$ = this.countriesQuery.countries$;
    this.userCountries$ = this.userCountriesQuery.userCountries$;
    this.searchResults$ = this.searchResultsQuery.results$;
    this.resultsLoading$ = this.searchResultsQuery.loading$;

    this.initSearchForm();
    this.initFilterForResults();
    this.initSearchResultForm();

  }

  initSearchForm() {

    this.searchForm = this.fb.group({
      userName: ['', Validators.required],
      countryName: [''],
      visited: [this.binOptions['any']],
      hasVisa: [this.binOptions['any']],
    });

  }

  initSearchResultForm() {

    this.searchResults$.pipe(
      map(results => this.createFormForResults(results)),
      tap(form => this.searchResultForm = form),
      switchMap(form => combineLatest(form.valueChanges, this.searchResults$)),
      untilDestroyed(this)
    ).subscribe(([formValue, results]) => {

      const { visited, hasVisa } = formValue;

      results.forEach((result, i) => {

        let dirty = result.visited !== visited[i];
        dirty = dirty || result.hasVisa !== hasVisa[i];

        if (dirty) {

          this.searchService.updateResult({
            ...result,
            visited: visited[i],
            hasVisa: hasVisa[i],
            dirty: true,
          });

        }

      });

    });

  }

  private createFormForResults(results: SearchResult[]): FormGroup {

    const visitedFormArray = this.fb.array([]);
    const hasVisaFormArray = this.fb.array([]);

    results.forEach(item => {

      visitedFormArray.push(this.fb.control(item.visited));
      hasVisaFormArray.push(this.fb.control(item.hasVisa));

    });

    return this.fb.group({
      visited: visitedFormArray,
      hasVisa: hasVisaFormArray,
    });
  }

  initFilterForResults() {

    this.searchResults$ = this.searchResults$.pipe(
      map(results => {

        const formValue = this.searchForm.value;

        return results.filter(item => {

          let ret = true;

          if (formValue.countryName.length) {

            ret = item.country.name === formValue.countryName;

          }

          ret = ret && formValue.visited.has(item.visited);
          ret = ret && formValue.hasVisa.has(item.hasVisa);

          return ret;

        });
      })
    );

  }

  loadUserCoutries() {

    this.userCountriesService.loadAllUserCountries()
      .pipe(untilDestroyed(this))
      .subscribe(null, error => {
        this.snackBar.open(
          `Error loading users. Details: ${error.message}`,
          null,
          { duration: 3000 }
        );
      });

  }

  loadUsers() {

    this.usersService.loadAllUsers()
      .pipe(untilDestroyed(this))
      .subscribe(null, error => {
        this.snackBar.open(
          `Error loading users. Details: ${error.message}`,
          null,
          { duration: 3000 }
        );
      });

  }

  loadCountries() {

    this.countriesService.loadAllCountries()
      .pipe(untilDestroyed(this))
      .subscribe(null, error => {
        this.snackBar.open(
          `Error loading countries. Details: ${error.message}`,
          null,
          { duration: 3000 }
        );
      });

  }

  onSubmitSearchForm() {

    if (this.searchForm.invalid) { return; }

    const formValue = this.searchForm.value;
    const user = this.usersQuery.getUserByName(formValue.userName);
    const countries = this.countriesQuery.getAll();
    const users = this.usersQuery.getAll();
    const userCountries = this.userCountriesQuery.getAll();

    if (!user) {

      this.snackBar.open(
        `user not found`,
        null,
        { duration: 3000 }
      );

      return;

    }

    // O(n)
    const indexes = {};
    const forAllCountries = countries.map(country => {

      const ret = createSearchResult({
        country,
        user,
      });

      indexes[country.id] = ret;
      return ret;

    });

    // O(n)
    userCountries.forEach(userCountry => {

      let condition = userCountry.userId !== user.id;
      condition = condition || !indexes[userCountry.countryId];
      if (condition) { return; }

      const data = indexes[userCountry.countryId];
      data.visited = userCountry.visited;
      data.hasVisa = userCountry.hasVisa;
      data.userCountryId = userCountry.id;

    });

    this.searchService.setResults(forAllCountries);

  }

  private toUserCountries(items: SearchResult[]): UserCountryInterface[] {

    return items.map(item => {
      return {
        id: item.userCountryId,
        userId: item.user.id,
        countryId: item.country.id,
        visited: item.visited,
        hasVisa: item.hasVisa,
      };
    });

  }

  saveChanges() {

    if (this.isLockedResultsForm) { return; }
    this.isLockedResultsForm = true;

    this.searchResults$.pipe(
      first(),
      map(results => results.filter(result => result.dirty)),
      map(changes => this.toUserCountries(changes)),
      switchMap(userCountries => {

        const requests = userCountries.map(data => {
          return this.userCountriesService.upsertUserCountry(data);
        });

        return zip(...requests);

      }),
      finalize(() => this.isLockedResultsForm = false),
      untilDestroyed(this)
    ).subscribe(_ => {

      this.searchService.clearDirty();

      this.snackBar.open(
        `Data saved!`,
        null,
        { duration: 3000 }
      );

    }, error => {
      this.snackBar.open(
        `Error saving. Details: ${error.message}`,
        null,
        { duration: 3000 }
      );
    });

  }

  ngOnDestroy() {

    this.searchService.clearResults();

  }

}
