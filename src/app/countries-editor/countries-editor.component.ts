import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { switchAll } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { CountryInterface } from '../interfaces/country.interface';
import { CountriesService } from '../countries.service';
import { CountriesQuery } from '../countries.query';

@Component({
  selector: 'app-countries-editor',
  templateUrl: './countries-editor.component.html',
  styleUrls: ['./countries-editor.component.scss']
})
export class CountriesEditorComponent implements OnInit, OnDestroy {

  countries$: Observable<CountryInterface[]>;
  newCountryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private countriesService: CountriesService,
    private countriesQuery: CountriesQuery,
  ) { }

  ngOnInit() {

    this.initNewCountryForm();
    this.loadCountries();
    this.countries$ = this.countriesQuery.countries$;

  }

  initNewCountryForm() {

    this.newCountryForm = this.fb.group({
      name: ['', Validators.required],
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

  onSubmitNewCountry() {

    if (this.newCountryForm.invalid) {

      Object.values(this.newCountryForm.controls)
        .forEach(control => control.markAsTouched());

      return;
    }

    const data = {
      ...this.newCountryForm.value,
    };

    this.countriesService.addCountry(data)
      .pipe(untilDestroyed(this))
      .subscribe(_ => {

        this.newCountryForm.reset();

        this.snackBar.open('country created!', null, {
          duration: 3000,
        });

      }, error => {

        this.snackBar.open(
          `Error creating country. Details: ${error.message}`,
          null,
          { duration: 3000 }
        );

      });

  }

  deleteCountry(id: number) {

    this.countriesService.removeCountry(id)
      .pipe(untilDestroyed(this))
      .subscribe(_ => {

        this.snackBar.open(
          'country deleted.',
          null,
          { duration: 3000 }
        );

      }, error => {

        this.snackBar.open(
          `Error deleting country. Details: ${error.message}`,
          null,
          { duration: 3000 }
        );

      });

  }

  ngOnDestroy() {}

}
