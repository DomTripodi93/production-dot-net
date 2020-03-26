import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Employee } from './employee.model';
import { map } from 'rxjs/operators';

@Injectable({providedIn:'root'})
export class EmployeeService {

  constructor(
      private http: HttpClient,
      private auth: AuthService
  ){}

  getUserDetails(){
    return this.http.get(
      this.auth.apiUrl + "/employee/"
    )
    .pipe(
      map((responseData: Employee[]) => {
      return responseData;
      })
    )
  };
  //Returns all employees associated to a user


}