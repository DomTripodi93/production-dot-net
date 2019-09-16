import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Hourly } from './hourly.model';
import { Change } from '../shared/change.model';
import { Machine } from '../machine/machine.model';

@Injectable({providedIn: 'root'})
export class HourlyService {
    hourlyChanged = new Subject();
    machineHold = "";
    quick = [];
    jobNumber ="";
    machine: Machine;
    model = "Hourly"

    constructor(
        private http: HttpClient,
        private auth: AuthService
        ) {}

    fetchHourly(search) {
        return this.http.get(
          this.auth.apiUrl + '/hourly/' + search
        )
        .pipe(
          map((responseData: Hourly[]) => {
            responseData.forEach((lot)=>{
              lot.machine = this.auth.rejoin(lot.machine);
            })
          return responseData;
          })
        )
    } 

    fetchHourlyById(id) {
        return this.http.get(
          this.auth.apiUrl + '/hourly/' + id + "/"
        )
        .pipe(
          map((responseData: Hourly) => {
            responseData.machine = this.auth.rejoin(responseData.machine);
          return responseData;
          })
        )
    } 
  
    fetchAllHourly() {
        return this.http.get(
          this.auth.apiUrl + '/hourly/'
        )
        .pipe(
          map((responseData: Hourly[]) => {
            responseData.forEach((lot)=>{
              lot.machine = this.auth.rejoin(lot.machine);
            })
          return responseData;
          })
        )
      }

    addHourly(data: Hourly){
      data.machine = this.auth.splitJoin(data.machine);
        return this.http.post(
          this.auth.apiUrl + '/hourly/', data
        );
    }


    changeHourly(data: Hourly, id){
      this.fetchHourlyById(id).subscribe((object)=>{
        let oldValues = ""+JSON.stringify(object);
        this.auth.logChanges(oldValues, this.model, "Update", id).subscribe();
      })
      data.machine = this.auth.splitJoin(data.machine)
        return this.http.put(
          this.auth.apiUrl + '/hourly/' + id + "/", data
        );
    }

    deleteHourly(id){
      this.fetchHourlyById(id).subscribe((object)=>{
        let oldValues = ""+JSON.stringify(object);
        this.auth.logChanges(oldValues, this.model, "Delete", id).subscribe();
      })
        return this.http.delete(this.auth.apiUrl + "/hourly/" + id + "/",{
          observe: 'events',
          responseType: 'text'
          }
        )
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