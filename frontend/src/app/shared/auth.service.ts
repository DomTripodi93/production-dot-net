import { Injectable } from "@angular/core";
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpParams} from '@angular/common/http';
import { User } from '../register/user.model';
import { Signin } from '../register/signin/signin.model';
import { map } from 'rxjs/operators';
import { PaginatedResult } from './pagination';
import { Change } from './change.model';

@Injectable({providedIn:'root'})
export class AuthService {
  setStartTime: boolean = false;
  setBarCut: boolean = false;
  setBarEnd: boolean = false;
  buttonHidden = [false, false];
  token = '';
  user = '';
  name = '';
  isNew = false;
  defaultStartTime = "07:45";
  defaultStartTimeString = "07:45 AM";
  defaultBarEnd = "3";
  defaultBarCut = "48";
  isAuthenticated = true;
  authApiUrl = 'http://localhost:5000/api';
  apiUrl = 'http://localhost:5000/api/' + localStorage.getItem('id');
  authChanged = new Subject();
  machType = "";  
  makeOld = {
    isNew: false
  };
  makeNew = {
    isNew: true
  };

  constructor(
      private http: HttpClient
  ){}
  
  logout(){
    this.defaultStartTime = "07:45";
    this.defaultStartTimeString = "07:45 AM";
    this.defaultBarEnd = "3";
    this.defaultBarCut = "48";
    this.setStartTime = false;
    this.setBarCut = false;
    this.setBarEnd= false;
    this.buttonHidden = [false, false];
    this.user = '';
    this.token = '';
    this.name = '';
    this.isAuthenticated = false;
    this.isNew = false;
    localStorage.setItem('token', '');
    localStorage.setItem('id', '');
    this.authChanged.next();
  };
  //Resets all related values from Login to their initial values, and activated authentication 
  // observable subscription actions

  registerUser(data: User){
    return this.http.post(
      this.authApiUrl + '/auth/register',
      data
    );
  };
  //Posts User Creation Data to registration end-point

  signinUser(data: Signin){
    return this.http.post(
      this.authApiUrl + '/auth/login',
      data,
      {
        observe: 'response'
      }
    );
  };
  //Sends Email and Password to backend to return User Token, and Id for Future API Calls

  getUserDetails(){
    return this.http.get(
      this.authApiUrl + "/user/" + this.user
    );
  };
  //Sends API Call with Token and User ID to verify User and Set Authenticated Value to true 
  // from App Component

  checkSettings(){
    return this.http.get(
      this.apiUrl + "/settings/",
    )
    .pipe(
      map((responseData: User) => {
        this.isNew = responseData.isNew;
        if (responseData.defaultBarCut){
          this.defaultBarCut = responseData.defaultBarCut;            
        }
        if (responseData.defaultBarEnd){
          this.defaultBarEnd = responseData.defaultBarEnd;            
        }
        if (responseData.defaultStartTime){
          this.defaultStartTime = responseData.defaultStartTime;
          if (+(this.defaultStartTime[0]+this.defaultStartTime[1])==12) {
            this.defaultStartTimeString = this.defaultStartTime + " PM";
            //Sets Default Start Time Display Value for 12:00PM-12:59PM 
          } else if (+(this.defaultStartTime[0]+this.defaultStartTime[1])>11){
            let timeHold = +(this.defaultStartTime[0]+this.defaultStartTime[1]) - 12;
            this.defaultStartTimeString = timeHold + this.defaultStartTime.slice(2, 5) + " PM";
            //Sets Default Start Time Display Value for 1:00PM-11:59PM
          } else if (+(this.defaultStartTime[0]+this.defaultStartTime[1]) == 0) {
            let timeHold = +(this.defaultStartTime[0]+this.defaultStartTime[1]) + 12;
            this.defaultStartTimeString = timeHold + this.defaultStartTime.slice(2, 5) + " AM";
            //Sets Default Start Time Display Value for 12:00AM-12:59AM
          } else {
            let timeHold = +(this.defaultStartTime[0]+this.defaultStartTime[1]);
            this.defaultStartTimeString = timeHold + this.defaultStartTime.slice(2, 5) + " AM";
            //Sets Default Start Time Display Value for 1:00AM-11:59AM
          };      
        }
      return responseData;
      })
    );
  };
  //Sends Get Request to Settings Endpoint to return and Set User's Settings where applicable

  fetchChanges(model, page?, itemsPerPage?): Observable<PaginatedResult<Change[]>> {
    const paginatedResult: PaginatedResult<Change[]> = new PaginatedResult<Change[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null){
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }

      return this.http.get(
        this.apiUrl + '/changelog/' + model, { observe: "response", params })
        .pipe(
          map((responseData: any) => {
            paginatedResult.result = responseData.body;
            if (responseData.headers.get("Pagination") != null){
              paginatedResult.pagination = JSON.parse(responseData.headers.get("Pagination"));
            }
              return paginatedResult;
          })
        )
  }
  //Gets Values for specified model for Change-Log viewing, showing the original values 
  // of the model, which are set and displayed based on the model of the edited value

  changeNew(){
    if (this.isNew == true){
      this.changeSetting("new", this.makeOld).subscribe(()=>{
        this.authChanged.next();
      });
    } else {
      this.changeSetting("new", this.makeNew).subscribe(()=>{
        this.authChanged.next();
      });
    }
  }
  //Checks if tutorials are active, and either activates or deactivates them for the 
  // current user

  changeSetting(path, data){
    return this.http.put(
      this.apiUrl + "/settings/" + path, data      
    );
  }
  //Updates settings value other than Tutorials

  logChanges(values, model, type, id){
    let data = {
      'oldValues': " "+values,
      'changeType': type,
      'changedId': id,
      'changedModel': model
    }
    return this.http.post(
      this.apiUrl + '/changelog/', data
    );
  }
  //Logs the old values of a model before updating to be reviewed at a later time

  splitJoin(machine: string){
    let machineHold1: string;
    let machineHold2 = machine.split(" ");
    machineHold1 = machineHold2.join("-")
    machine = machineHold1
      return machine;
  }
  //Turns multi-word machine names into a single word by joining them with slashes before 
  // using them in the database, or searches for them in the database so that searching 
  // returns consistant results

  rejoin(machine){
    let machineHold1 = machine;
    let machineHold2 = machineHold1.split("-");
    machineHold1 = machineHold2.join(" ")
    machine = machineHold1
      return machine;
  }
  //Returns multi-word machine names where the words are joined by slashes for API Searchability
  // to a multi-word string

  hideButton(i){
    setTimeout(()=>{
      this.buttonHidden[i] = true;
    })
  }
  //Hides one of two buttons that consistantly need to be conditionally hidden accross multiple
  // components

  showButton(i){
    setTimeout(()=>{
      this.buttonHidden[i] = false;
    })
  }
  //Shows one of two buttons that consistantly need to be conditionally hidden accross multiple
  // components

}