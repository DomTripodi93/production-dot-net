import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Machine } from './machine.model';
import { Change } from '../shared/change.model';

@Injectable({providedIn: 'root'})
export class MachineService {
    machChanged = new Subject();
    model = "Machine"

    constructor(
        private http: HttpClient,
        private auth: AuthService
        ) {}

    fetchMachine(search) {
        return this.http.get(
          this.auth.apiUrl + '/machine/?search=' + search
        )
        .pipe(
          map((responseData: Machine[]) => {
            const machHold: Machine[] = [];
            responseData.forEach(data => {
              machHold.push(data);                
            });
          return machHold;
          })
        )
    } 

    fetchMachineById(id) {
        return this.http.get(
          this.auth.apiUrl + '/machine/' + id + "/"
        )
        .pipe(
          map((responseData: Machine) => {
          return responseData;
          })
        )
    } 
  
    fetchAllMachines() {
        return this.http.get(
          this.auth.apiUrl + '/machine/'
        )
        .pipe(
          map((responseData: Machine[]) => {
            const machHold: Machine [] = responseData;
          return machHold;
          })
        )
    }

    fetchMachineJobs(){
        return this.http.get(
          this.auth.apiUrl + '/machine/?ordering=-current_job'
        )
        .pipe(
          map((responseData: Machine[]) => {
            const machHold: Machine [] = responseData;
          return machHold;
          })
        )
    }

    addMachine(data: Machine){
      if (!data.current_job){
          data.current_job=null
      }
        return this.http.post(
          this.auth.apiUrl + '/machine/', data
        );
    }

    setCurrentJob(job, id){
      this.fetchMachineById(id).subscribe((object)=>{
        console.log(job);
        let old_values = ""+JSON.stringify(object);
        this.auth.logChanges(old_values, this.model, "Change Job", id).subscribe();
      })
      return this.http.patch(
        this.auth.apiUrl + '/machine/' + id + "/", job
      );

    }

    changeMachine(data: Machine, id){
      this.fetchMachineById(id).subscribe((object)=>{
        let old_values = ""+JSON.stringify(object);
        this.auth.logChanges(old_values, this.model, "Update", id).subscribe();
      })
      if (!data.current_job){
          data.current_job=null
      }
        return this.http.put(
          this.auth.apiUrl + '/machine/' + id + "/", data
        );
    }

    deleteMachine(id){
      this.fetchMachineById(id).subscribe((object)=>{
        let old_values = ""+JSON.stringify(object);
        this.auth.logChanges(old_values, this.model, "Delete", id).subscribe();
      })
      return this.http.delete(this.auth.apiUrl + "/machine/" + id + "/",
      {
          observe: 'events',
          responseType: 'text'
      })
      .pipe(
          tap(event => {
              console.log(event);
              if (event.type === HttpEventType.Sent){
                  console.log('control')
              }
              if (event.type === HttpEventType.Response) {
                  console.log(event.body);
              }
          })
      );
    }
      
}