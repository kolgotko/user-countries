import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, retryWhen } from 'rxjs/operators';
import { UsersService } from '../users.service';
import { UserInterface } from '../interfaces/user.interface';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UsersQuery } from '../users.query';

@Component({
  selector: 'app-users-editor',
  templateUrl: './users-editor.component.html',
  styleUrls: ['./users-editor.component.scss']
})
export class UsersEditorComponent implements OnInit, OnDestroy {

  users$: Observable<UserInterface[]>;
  newUserForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private usersQuery: UsersQuery,
  ) { }

  ngOnInit() {

    this.initNewUserForm();
    this.loadAllUsers();
    this.users$ = this.usersQuery.users$;

  }

  loadAllUsers() {

    this.usersService.loadAllUsers()
      .pipe(untilDestroyed(this))
      .subscribe(null, error => {
        this.snackBar.open(`Error loading users. Details: ${error.message}`);
      });

  }

  initNewUserForm() {

    this.newUserForm = this.fb.group({
      name: ['', Validators.required ],
    });

  }

  onSubmitNewUser() {

    if (this.newUserForm.invalid) {
      Object.values(this.newUserForm.controls)
        .forEach(control => control.markAsTouched());

      return;
    }

    const data = {
      ...this.newUserForm.value,
    };

    this.usersService.addUser(data)
      .pipe(untilDestroyed(this))
      .subscribe(_ => {

        this.newUserForm.reset();

        this.snackBar.open(
          `user "${data.name}" created!`,
          null,
          { duration: 3000 }
        );

      }, error => {

        this.snackBar.open(
          `Error creating user. Details: ${error.message}`,
          null,
          { duration: 3000 }
        );

      });

  }

  onDeleteUser(id: number) {

    this.usersService.removeUser(id)
      .pipe(untilDestroyed(this))
      .subscribe(_ => {

        this.snackBar.open(
          `user deleted!`,
          null,
          { duration: 3000 }
        );

      }, error => {

        this.snackBar.open(
          `Error delete user. Details: ${error.message}`,
          null,
          { duration: 3000 }
        );

      });

  }

  ngOnDestroy() { }

}
