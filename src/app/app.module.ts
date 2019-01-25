import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersEditorComponent } from './users-editor/users-editor.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { CountriesEditorComponent } from './countries-editor/countries-editor.component';
import { CountryEditorComponent } from './country-editor/country-editor.component';
import { UserCountriesComponent } from './user-countries/user-countries.component';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    UsersEditorComponent,
    UserEditorComponent,
    CountriesEditorComponent,
    CountryEditorComponent,
    UserCountriesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    ...(environment.production ?  [] : [ AkitaNgDevtools.forRoot(), AkitaNgRouterStoreModule.forRoot() ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
