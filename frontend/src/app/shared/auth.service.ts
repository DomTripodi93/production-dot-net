import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { User } from '../register/user.model';
import { Signin } from '../register/signin/signin.model';
import { map } from 'rxjs/operators';

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
  defaultBarEnd = "3";
  defaultBarCut = "48";
  isAuthenticated = true;
  authApiUrl = 'http://localhost:5000/api'
  apiUrl = 'http://localhost:5000/api/' + localStorage.getItem('id');
  public authChanged = new Subject();
  makeOld = {
    isNew: false
  }
  makeNew = {
    isNew: true
  }

  constructor(
      private http: HttpClient
  ){}
  
  logout(){
      this.user = '';
      this.token = '';
      this.name = '';
      this.isAuthenticated = false;
      this.isNew = false;
      localStorage.setItem('token', '');
      localStorage.setItem('id', '');
      this.authChanged.next();
  }

  registerUser(data: User){
    return this.http.post(
      this.authApiUrl + '/auth/register',
      data
    )
  }

  signinUser(data: Signin){
      return this.http.post(
        this.authApiUrl + '/auth/login',
        data,
        {
          observe: 'response'
        }
      )
  }

  getUserDetails(){
    return this.http.get(
      this.authApiUrl + "/user/" + this.user,
      {
        observe: "response"
      }
    )
  }

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
        }
      return responseData;
      })
    )
  }

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

  changeSetting(path, data){
    return this.http.put(
      this.apiUrl + "/settings/" + path, data      
    );
  }

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

  splitJoin(machine: string){
      let machineHold1: string;
      let machineHold2 = machine.split(" ");
      machineHold1 = machineHold2.join("-")
      machine = machineHold1
        return machine;
  }

  rejoin(machine){
      let machineHold1 = machine;
      let machineHold2 = machineHold1.split("-");
      machineHold1 = machineHold2.join(" ")
      machine = machineHold1
        return machine;
  }

  hideButton(i){
      setTimeout(()=>{
        this.buttonHidden[i] = true;
      })
  }

  showButton(i){
      setTimeout(()=>{
        this.buttonHidden[i] = false;
      })
  }
}