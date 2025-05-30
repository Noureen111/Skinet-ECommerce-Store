import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, User } from '../../shared/models/User';
import { map, tap } from 'rxjs';
import { SignalrService } from '../seevices/signalr.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

  constructor(
    private http: HttpClient,
    private signalrService: SignalrService
  ) { }

  // login(values: any) {
  //   let params = new HttpParams();
  //   params.append("useCookies", "true");
  //   return this.http.post<User>(this.baseUrl + "login", values, {params, withCredentials: true});
  // }

  login(values: any) {
    let params = new HttpParams().set("useCookies", true);
    return this.http.post<User>(this.baseUrl + "login", values, {params}).pipe(
      tap(() => this.signalrService.createHubConnection())
    );
  }
  // loginWithoutCookie(values: any) {
  //   let params = new HttpParams();
  //   // params.append("useCookies", true);
  //   return this.http.post<User>(this.baseUrl + "login", values, {params, withCredentials: true});
  // }

  register(values: any) {
    return this.http.post(this.baseUrl + "account/register", values);
  }

  getUserInfo() {
    return this.http.get<User>(this.baseUrl + "account/user-info").pipe(
      map((user: any) => {
        this.currentUser.set(user);
        return user;
      })
    )
  }

  logout() {
    return this.http.post(this.baseUrl + "account/logout", {}).pipe(
      tap(() => this.signalrService.stopHubConnection())
    );
  }

  updateAddress(address: Address) {
    return this.http.post(this.baseUrl + "account/address", address).pipe(
      tap(() => {
        this.currentUser.update(user => {
          if(user) user.address = address;
          return user;
        })
      })
    );
  }

  getAuthStatus() {
    return this.http.get<{isAuthenticated: boolean}>(this.baseUrl + "account/auth-status");
  }
}
