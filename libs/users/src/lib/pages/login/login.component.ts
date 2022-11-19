import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  isSubmitted = false;
  authError = false;
  authMessage = 'Email or Password are wrong';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private localStorageService: LocalstorageService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.isSubmitted = true;

    this.auth
      .login(
        this.loginFormGroup.controls.email.value,
        this.loginFormGroup.controls.password.value
      )
      .subscribe(
        (user) => {
          this.authError = false;
          this.localStorageService.setToken(user.token);
          this.router.navigate(['/']);
        },
        (error: HttpErrorResponse) => {
          // console.log(error);
          this.authError = true;
          if (error.status !== 400) {
            this.authMessage = 'Error In the Server,  please try again later!';
          }
        }
      );
  }
}
