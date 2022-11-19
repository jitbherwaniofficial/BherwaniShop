import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PasswordModule} from 'primeng/password';


export const usersRoutes: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
  },
];

// const routes : Routes = [
//   {
//     path:'login',
//     component: LoginComponent
//   }
// ]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(usersRoutes),
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule
  ],
  declarations: [LoginComponent],
})
export class UsersModule {}
