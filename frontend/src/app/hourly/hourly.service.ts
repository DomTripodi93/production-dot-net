import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Hourly } from './hourly.model';
import { Machine } from '../machine/machine.model';
import { OpService } from '../job/job-ops/operation.service';
import { DaysService } from '../shared/days/days.service';

@Injectable({providedIn: 'root'})
export class HourlyService {
    hourlyChanged = new Subject();
    machineHold = "";
    quick = [];
    jobNumber ="";
    opNumber ="";
    machine: Machine;
    model = "Hourly"
    isJob: boolean[] = [];
    setTime: boolean[] = [];
    canSetTime: boolean[] = [];
    noStart: boolean[] = [];
    editMode: boolean[] = [];

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private opServ: OpService,
        private dayServ: DaysService
        ) {}

    fetchHourly(search) {
        return this.http.get(
          this.auth.apiUrl + '/hourly/' + search
        )
        .pipe(
          map((responseData: Hourly[]) => {
            responseData.forEach((lot)=>{
              lot.opNumber = this.dayServ.dashToSlash(lot.opNumber);
              lot.machine = this.auth.rejoin(lot.machine);
            })
          return responseData;
          })
        )
    } 

    fetchHourlyById(id) {
        return this.http.get(
          this.auth.apiUrl + '/hourly/' + id 
        )
        .pipe(
          map((responseData: Hourly) => {
            responseData.opNumber = this.dayServ.dashToSlash(responseData.opNumber);
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
              lot.opNumber = this.dayServ.dashToSlash(lot.opNumber);
              lot.machine = this.auth.rejoin(lot.machine);
            })
          return responseData;
          })
        )
      }

    addHourly(data: Hourly){
      data.opNumber = this.opServ.slashToDash(data.opNumber);
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
      data.opNumber = this.opServ.slashToDash(data.opNumber);
      data.machine = this.auth.splitJoin(data.machine);
        return this.http.put(
          this.auth.apiUrl + '/hourly/startTime/' + id, data
        );
    }

    changeStartTime(data, id){
      this.fetchHourlyById(id).subscribe((object)=>{
        let oldValues = ""+JSON.stringify(object);
        this.auth.logChanges(oldValues, this.model, "Update Start Time", id).subscribe();
      })
        return this.http.put(
          this.auth.apiUrl + '/hourly/startTime/' + id, data
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
            }
          )
        );
    }

}