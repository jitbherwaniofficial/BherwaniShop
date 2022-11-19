import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UsersService } from '@grafficocreation/users';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';


@Component({
  selector: 'grafficocreation-users-form',
  templateUrl: './users-form.component.html',
  styles: [],
})
export class UsersFormComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentUserId: string;
  countries = [];
  
  

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private usersService: UsersService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: [''],
      // token: [''],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: [''],
    });

    this._checkEditMode();
    this._getCountries();
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
    
    console.log(this.countries);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const user: User = {
      id: this.currentUserId,
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      phone: this.form.controls.phone.value,
      isAdmin: this.form.controls.isAdmin.value,
      street: this.form.controls.street.value,
      apartment: this.form.controls.apartment.value,
      zip: this.form.controls.zip.value,
      city: this.form.controls.city.value,
      country: this.form.controls.country.value
    };

    if (this.editMode) {
      this._updateUser(user);
    } else {
      this._addUser(user);
    }
  }

  onCancel() {
    this.location.back();
  }

  private _addUser(user: User) {
    this.usersService.createUser(user).subscribe(
      (user: User) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${user.name} is Created`,
        });
        timer(1000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User is not Created',
        });
      }
    );
  }

  private _updateUser(user: User) {
    this.usersService.updateUser(user).subscribe(
      (user: User) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${user.name} is Updated`,
        });
        timer(1000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User is not Created',
        });
      }
    );
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editMode = true;
        this.currentUserId = params.id;
        this.usersService.getUser(params.id).subscribe((user) => {
          this.form.controls.name.setValue(user.name);
          this.form.controls.email.setValue(user.email);
          this.form.controls.isAdmin.setValue(user.isAdmin);
          this.form.controls.street.setValue(user.street);
          this.form.controls.apartment.setValue(user.apartment);
          this.form.controls.zip.setValue(user.zip);
          this.form.controls.city.setValue(user.city);
          this.form.controls.country.setValue(user.country);
          this.form.controls.password.setValidators([]);
          this.form.controls.password.updateValueAndValidity();
        });
      }
    });
  }
}
