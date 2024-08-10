import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IUser } from '../Model/IUser';
import { IGetuserRequest } from '../Model/Requests/IGetUserRequest';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private getUserUrl = `${environment.baseApiUrl}api/users/user-info`;
  redirectUrl: string | undefined;
  currentUser: IUser | null = null;

  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<IUser> {
    return this.getUserFromDb(userName, password).pipe(
      tap(user => {
        if (user) {
          this.setCookie('isLoggedIn', 'true', 1);
          this.setCookie('isAdmin', user.IsAdmin.toString(), 1);
          this.currentUser = user;
        }
      })
    );
  }

  logout(): void {
    this.setCookie('isLoggedIn', 'false', 1);
    this.setCookie('isAdmin', 'false', 1);
    this.currentUser = null;
  }

  get isAdmin(): boolean {
    const admin = this.getCookie('isAdmin');
    return admin === 'true';
  }

  get isLoggedIn(): boolean {
    const logged = this.getCookie('isLoggedIn');
    return logged === 'true';
  }

  get isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }

  private getUserFromDb(userName: string, password: string): Observable<IUser> {
    const searchParam: IGetuserRequest = { UserName: userName, Password: password };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<IUser>(this.getUserUrl, searchParam, httpOptions);
  }

  private setCookie(name: string, value: string, days: number): void {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}
