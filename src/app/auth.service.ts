import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, BehaviorSubject, Subject, of, Subscription } from "rxjs";
import { delay } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})


export class AuthService {


  private userLoggedIn = new Subject<boolean>();
  authToken: any;
  refreshTokenValue: any;
  user: any;
  tokenSubscription = new Subscription()
  timeout;
  apiUrl = 'http://64.225.52.181:3000/';

  constructor(private router: Router, private http: HttpClient) {
    this.userLoggedIn.next(false);
   }



  setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

  authenticateUser(user: Object): Observable<any> {
    return this.http.post(this.apiUrl+'api/login', user, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    });
  }

  registerUser(user: Object): Observable<any> {
    return this.http.post(this.apiUrl+'api/signup', user, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    });
  }

  storeUserData(id, token, user, refreshToken) {
    const jwtHelper = new JwtHelperService();
    this.timeout = jwtHelper.getTokenExpirationDate(token).valueOf() - new Date().valueOf();
    sessionStorage.setItem("id_token", token);
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("id", JSON.stringify(id));
    this.authToken = token;
    this.user = user;
    this.refreshTokenValue = refreshToken;
    // this.emit({ username: this.user.username });
    this.expirationCounter(this.timeout);
  }

  refreshTokenData(token){


    sessionStorage.setItem("id_token", token);
    this.authToken = token;
    this.resetTimer(token);

  }

  resetTimer(token){

    const jwtHelper = new JwtHelperService();
    this.timeout = jwtHelper.getTokenExpirationDate(token).valueOf() - new Date().valueOf();
    this.expirationCounter(this.timeout);
  }

  expirationCounter(timeout) {

    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null).pipe(delay(timeout)).subscribe((expired) => {
      console.log('EXPIRED!!');

      this.logout();
      this.router.navigate(["/login"]);
    });
  }

    logout() {
    this.tokenSubscription.unsubscribe();
    this.authToken = null;
    this.user = null;
    sessionStorage.clear();
  }

  refreshToken(): Observable<any> {
    return this.http.post(this.apiUrl+'api/refreshToken', {username: this.user, token: this.refreshTokenValue}, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+this.authToken
      })
    });
  }
  getBudgetIdFromDB(param:Object): Observable<any> {
    return this.http.post(this.apiUrl+'api/getBudgetId', param, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+this.authToken
      })
    });
  }

  addBudgetIdToDB(param:Object): Observable<any> {
    return this.http.post(this.apiUrl+'api/addBudgetId', param, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+this.authToken
      }, )
    });
  }

  getBudgetsFromDB(budgetId:string): Observable<any> {

    return this.http.get(this.apiUrl+`api/budgetID/${budgetId}`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+this.authToken
      })
    });
  }

  addBudgetsToDB(param:Object): Observable<any> {

    return this.http.post(this.apiUrl+'api/addBudgets', param, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+this.authToken
      })
    });
  }

  deleteBudgetsFromDB(budgetId:string): Observable<any> {

    return this.http.delete(this.apiUrl+`api/budgetID/${budgetId}`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+this.authToken
      })
    });
  }
}
