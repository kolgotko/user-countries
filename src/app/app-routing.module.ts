import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersEditorComponent } from './users-editor/users-editor.component';
import { CountriesEditorComponent } from './countries-editor/countries-editor.component';

const routes: Routes = [
  { path: 'editor/users', component: UsersEditorComponent },
  { path: 'editor/countries', component: CountriesEditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
