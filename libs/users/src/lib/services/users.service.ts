import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '@env/environment'
import * as countriesLib from 'i18n-iso-countries';

declare const require;


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  apiURLUser = environment.apiURL + 'users';

  constructor(private http : HttpClient) {countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));}

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(this.apiURLUser)
  }
  getUser(userId:string):Observable<User>{
    return this.http.get<User>(`${this.apiURLUser}/${userId}`)
  }

  createUser(user:User):Observable<User>{
    return this.http.post<User>(this.apiURLUser,user)
  }

  updateUser(user:User):Observable<User>{
    return this.http.put<User>(`${this.apiURLUser}/${user.id}`,user)
  }

  deleteUser(userId:string):Observable<any>{
    return this.http.delete<any>(`${this.apiURLUser}/${userId}`)
  }

  getCountries():{id:string;name:string;}[] {
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
    return Object.entries(countriesLib.getNames('en', { select: 'official' })).map((entry) => {
      return {
        id: entry[0],
        name: entry[1]
      };
    });
  }

  getCountry(countryKey: string): string {
    return countriesLib.getName(countryKey, 'en');
  }

  getUsersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLUser}/get/count`)
      .pipe(map((objectValue: any) => objectValue.userCount));
  }

}
