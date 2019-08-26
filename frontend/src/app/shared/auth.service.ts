import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { User } from '../register/user.model';
import { Signin } from '../register/signin/signin.model';
import { map } from 'rxjs/operators';

@Injectable({providedIn:'root'})
export class AuthService {
    buttonHidden = [false, false];
    token = '';
    user = '';
    name = '';
    isNew = false;
    isAuthenticated = false;
    apiUrl = 'http://localhost:5000/api';
    public authChanged = new Subject();
    makeOld = {
      is_new: false
    }
    makeNew = {
      is_new: true
    }

    constructor(
        private http: HttpClient
    ){}
    
    logout(){
        this.user = '';
        this.token = '';
        this.name = '';
        this.isAuthenticated = false;
        localStorage.setItem('token', '');
        localStorage.setItem('id', '');
        this.authChanged.next();
    }

    registerUser(data: User){
      return this.http.post(
        this.apiUrl + '/auth/register/',
        data
      )
    }

    signinUser(data: Signin){
        return this.http.post(
          this.apiUrl + '/auth/login/',
          data,
          {
            observe: 'response'
          }
        )
    }

    getUserDetails(email){
      return this.http.get(
        this.apiUrl + "/auth/" + email,
        {
          observe: "response"
        }
      )
    }

    checkNew(id){
      return this.http.get(
        this.apiUrl + "/usersettings/" +id,
      )
      .pipe(
        map((responseData: User) => {
          this.isNew = responseData.is_new;
        return responseData;
        })
      )
    }

    changeNew(id){
      if (this.isNew == true){
        return this.http.patch(
          this.apiUrl + "/usersettings/" + id + "/", this.makeOld      
        );
      } else {
        return this.http.patch(
          this.apiUrl + "/usersettings/" + id + "/", this.makeNew
        );
      }
    }

    logChanges(values, model, type, id){
      let data = {
        'old_values': " "+values,
        'change_type': type,
        'changed_id': id,
        'changed_model': model
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