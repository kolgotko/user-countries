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
import { SearchResultInterface } from '../interfaces/search-result.interface';
import { Observable, of, from, combineLatest, zip  } from 'rxjs';
import { switchMap, map, pluck, tap, first } from 'rxjs/operators';

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
  searchResult: SearchResultInterface[] = [];
  searchResultForm: FormGroup;
  searchResults$: Observable<SearchResultInterface[]>;
  resultsLoading$: Observable<boolean>;
  displayedColumns = ['user', 'country', 'visited', 'hasVisa'];

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
      untilDestroyed(this)
    ).subscribe(results => {

      const visitedFormArray = this.fb.array([]);
      const hasVisaFormArray = this.fb.array([]);

      results.forEach(item => {

        visitedFormArray.push(this.fb.control(item.visited));
        hasVisaFormArray.push(this.fb.control(item.hasVisa));

      });

      this.searchResultForm = this.fb.group({
        visited: visitedFormArray,
        hasVisa: hasVisaFormArray,
      });

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
    const user$ = this.usersQuery.getUserByName(formValue.userName);
    const countries$ = this.countriesQuery.selectAll();
    const users$ = this.usersQuery.selectAll();
    const userCountries$ = this.userCountriesQuery.selectAll();

    combineLatest(user$, userCountries$, users$, countries$)
      .pipe(untilDestroyed(this))
      .subscribe(([user, userCountries, users, countries]) => {

        // O(n)
        const indexes = {};
        const forAllCountries = countries.map(country => {

          const ret = {
            country,
            user,
            visited: false,
            hasVisa: false,
            userCountryId: 0,
          };

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

      });

  }

  private getChangedResults<T extends SearchResultInterface>(results: T[]): T[] {

    const { visited, hasVisa } = this.searchResultForm.value;

    return results.filter((result, i) => {

      let cond = hasVisa[i] !== result.hasVisa;
      cond = cond || visited[i] !== result.visited;
      return cond;

    });

  }

  private applyChanges<T extends SearchResultInterface>(results: T[]): T[] {

    const { visited, hasVisa } = this.searchResultForm.value;

    return results.map((result, i) => {

      return {
        ...result,
        visited: visited[i],
        hasVisa: hasVisa[i],
      };

    });

  }

  private toUserCountries(items: SearchResultInterface[]): UserCountryInterface[] {

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

    this.searchResults$
      .pipe(
        first(),
        map(results => this.getChangedResults(results)),
        map(results => this.applyChanges(results)),
        map(changes => this.toUserCountries(changes)),
        switchMap(userCountries => {

          const requests = userCountries.map(data => {
            return this.userCountriesService.upsertUserCountry(data);
          });

          return zip(...requests);

        }),
        untilDestroyed(this)
      )
      .subscribe(_ => {

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
