import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Operation } from './operation.model';

@Injectable({providedIn: 'root'})
export class OpService {
    operationChanged = new Subject();
    operationHold: Operation;
    model = "Operation";

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {}


    holdOp(operation: Operation){
      this.operationHold = operation;
    }

    fetchOp(search) {
        return this.http.get(
          this.auth.apiUrl + '/operation/' + search
        )
        .pipe(
          map((responseData: Operation) => {
            responseData.machine = this.auth.rejoin(responseData.machine);
          return responseData;
          })
        )
    } 

    fetchOpByJob(search) {
        return this.http.get(
          this.auth.apiUrl + '/operation/' + search
        )
        .pipe(
          map((responseData: Operation[]) => {
            responseData.forEach((lot)=>{
              lot.machine = this.auth.rejoin(lot.machine);
            })
          return responseData;
          })
        )
    } 

    fetchOpById(id) {
        return this.http.get(
          this.auth.apiUrl + '/operation/' + id + "/"
        )
        .pipe(
          map((responseData: Operation) => {
            responseData.machine = this.auth.rejoin(responseData.machine);
          return responseData;
          })
        )
    } 
  
    fetchAllOps() {
        return this.http.get(
          this.auth.apiUrl + '/operation/'
        )
        .pipe(
          map((responseData: Operation[]) => {
            responseData.forEach((lot)=>{
              lot.machine = this.auth.rejoin(lot.machine);
            })
            const proHold: Operation [] = responseData;
          return proHold;
          })
        )
      }

      addOp(data: Operation){
        data.machine = this.auth.splitJoin(data.machine);
          return this.http.post(
            this.auth.apiUrl + '/operation/', data
          );
      }

      changeOp(data: Operation, id){
        this.fetchOpById(id).subscribe((object)=>{
          let oldValues = ""+JSON.stringify(object);
          this.auth.logChanges(oldValues, this.model, "Update", id).subscribe();
        })
        data.machine = this.auth.splitJoin(data.machine);
          return this.http.put(
            this.auth.apiUrl + '/operation/' + id + "/", data
          );
      }

      deleteOp(id){
        this.fetchOpById(id).subscribe((object)=>{
          let oldValues = ""+JSON.stringify(object);
          this.auth.logChanges(oldValues, this.model, "Delete", id).subscribe();
        })
          return this.http.delete(this.auth.apiUrl + "/operation/" + id + "/",{
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