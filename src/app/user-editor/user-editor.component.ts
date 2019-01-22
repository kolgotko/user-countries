import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserInterface } from '../interfaces/user.interface';
import { UsersService } from '../users.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit, OnDestroy {

  @Input() user: UserInterface;
  nameFormControl: FormControl;
  show = false;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {

    this.nameFormControl = this.fb.control(this.user.name, Validators.required);

  }

  loadUser(): Observable<UserInterface> {

    return this.usersService.getUserById(this.user.id);

  }

  onSaveUser() {

    const data = {
      id: this.user.id,
      name: this.nameFormControl.value,
    };

    this.usersService.updateUser(data)
      .pipe(
        switchMap(_ => this.loadUser()),
        untilDestroyed(this),
      )
      .subscribe(user => {

        this.show = false;
        this.user = user;
        this.snackBar.open('user saved!', null, { duration: 3000 });

      }, error => {

        this.snackBar.open(
          `Error saving user. Details: ${error.message}`,
          null,
          { duration: 3000 }
        );

      });

  }

  ngOnDestroy() {}

}
