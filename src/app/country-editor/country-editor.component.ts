import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { CountryInterface } from '../interfaces/country.interface';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { switchMap } from 'rxjs/operators';
import { CountriesService } from '../countries.service';
import { CountriesQuery } from '../countries.query';

@Component({
  selector: 'app-country-editor',
  templateUrl: './country-editor.component.html',
  styleUrls: ['./country-editor.component.scss']
})
export class CountryEditorComponent implements OnInit, OnDestroy {

  @Input() country: CountryInterface;
  nameFormControl: FormControl;
  show = false;

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
    private snackBar: MatSnackBar,
    private countriesQuery: CountriesQuery,
  ) { }

  ngOnInit() {

    this.nameFormControl = this.fb.control(this.country.name, Validators.required);

  }

  loadCountry(id: number) {

    return this.countriesService.getCountryById(id);

  }

  onSave() {

    if (this.nameFormControl.invalid) { return false; }

    const data = {
      id: this.country.id,
      name: this.nameFormControl.value,
    };

    this.countriesService.updateCountry(data)
      .pipe(
        switchMap(_ => this.countriesQuery.selectEntity(data.id)),
        untilDestroyed(this)
      )
      .subscribe(country => {

        this.country = country;
        this.show = false;
        this.snackBar.open('country saved!', null, { duration: 3000 });

      }, error => {

        this.snackBar.open(
          `Error saving country. Details: ${error.message}`,
          null,
          { duration: 3000 }
        );

      });

  }

  ngOnDestroy() {}

}
