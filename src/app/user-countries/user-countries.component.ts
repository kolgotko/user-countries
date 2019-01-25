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
import { Observable, of, combineLatest  } from 'rxjs';
import { switchMap, map, pluck } from 'rxjs/operators';

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
  searchResult: Object[] = [];
  searchResultForm: FormGroup;

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
  ) { }

  ngOnInit() {

    this.initSearchForm();
    this.initSearchResultForm();
    this.loadCountries();
    this.loadUsers();
    this.loadUserCoutries();
    this.users$ = this.usersQuery.users$;
    this.countries$ = this.countriesQuery.countries$;
    this.userCountries$ = this.userCountriesQuery.userCountries$;

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

    this.searchResultForm = this.fb.group({
      visited: this.fb.array([]),
      hasVisa: this.fb.array([]),
    });

  }

  loadUserCoutries() {

    this.userCountriesService.loadAllUserCountries()
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

    console.log(this.searchForm.value);
    if (this.searchForm.invalid) { return; }

    const formValue = this.searchForm.value;

    const user$ = this.usersQuery.getUserByName(formValue.userName);
    const countries$ = this.countriesQuery.selectAll();
    const users$ = this.usersQuery.selectAll();
    const userCountries$ = this.userCountriesQuery.selectAll();

    combineLatest(user$, userCountries$, users$, countries$)
      .subscribe(([user, userCountries, users, countries]) => {

        // O(n)
        const indexes = {};
        const forAllCountries = countries.map(country => {

          const ret = {
            country: country,
            user: user,
            visited: false,
            hasVisa: false,
          };

          indexes[country.id] = ret;
          return ret;

        });

        // O(n)
        userCountries.forEach(userCountry => {

          if (userCountry.userId !== user.id) { return; }

          const data = indexes[userCountry.countryId];
          data.visited = userCountry.visited;
          data.hasVisa = userCountry.hasVisa;

        });

        const result = forAllCountries.filter(item => {

          let ret = true;

          if (formValue.countryName.length) {

            ret = item.country.name === formValue.countryName;

          }

          ret = ret && formValue.visited.has(item.visited);
          ret = ret && formValue.hasVisa.has(item.hasVisa);

          return ret;

        });

        const visitedFormArray = this.fb.array([]);
        const hasVisaFormArray = this.fb.array([]);

        result.forEach(item => {

          visitedFormArray.push(this.fb.control(item.visited));
          hasVisaFormArray.push(this.fb.control(item.hasVisa));

        });

        this.searchResultForm.setControl('visited', visitedFormArray);
        this.searchResultForm.setControl('hasVisa', hasVisaFormArray);

        console.log(this.searchResultForm.value);

        this.searchResult = result;

      });

  }

  saveChanges() {

    console.log(this.searchResultForm.value);

  }

  ngOnDestroy() {}

}
