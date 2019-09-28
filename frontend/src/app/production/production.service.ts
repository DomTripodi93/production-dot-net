import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Production } from './production.model';
import { Part } from '../part/part.model';
import { JobService } from '../job/job.service';
import { Job } from '../job/job.model';

@Injectable({providedIn: 'root'})
export class ProductionService {
    proChanged = new Subject();
    model = "Production"

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private jobServ: JobService
        ) {}

    fetchProduction(search) {
        return this.http.get(
          this.auth.apiUrl + '/production/' + search
        )
        .pipe(
          map((responseData: Production[]) => {
            responseData.forEach((lot)=>{
              lot.machine = this.auth.rejoin(lot.machine);
            })
            const proHold: Production[] = [];
            responseData.forEach(data => {
              proHold.push(data);                
            });
          return proHold;
          })
        )
    } 

    fetchProductionBySearch(search) {
        return this.http.get(
          this.auth.apiUrl + '/production/' + search 
        )
        .pipe(
          map((responseData: Production) => {
            responseData.machine = this.auth.rejoin(responseData.machine);
          return responseData;
          })
        )
    } 
  
    fetchAllProduction() {
        return this.http.get(
          this.auth.apiUrl + '/production/'
        )
        .pipe(
          map((responseData: Production[]) => {
            responseData.forEach((lot)=>{
              lot.machine = this.auth.rejoin(lot.machine);
            })
            const proHold: Production [] = responseData;
          return proHold;
          })
        )
      }

    addProduction(data: Production){
      this.jobServ.fetchJob(data.jobNumber).subscribe((job: Job)=>{
        if (+job.remainingQuantity > 0){
          let value = +job.remainingQuantity - data.quantity;
          if (value >= 0){
            job.remainingQuantity = "" + value;
          } else {
            job.remainingQuantity = "0"
          }
        } else if (!job.remainingQuantity && job.possibleQuantity){
          let value = +job.possibleQuantity - data.quantity;
          job.remainingQuantity = "" + value;
        } else if (!job.remainingQuantity && job.orderQuantity){
          let value = +job.orderQuantity - data.quantity;
          job.remainingQuantity = "" + value;
        } else if (!job.remainingQuantity && job.weightQuantity){
          let value = +job.weightQuantity - data.quantity;
          job.remainingQuantity = "" + value;
        }
        this.jobServ.changeJob(job, data.jobNumber).subscribe()
      })
      data.machine = this.auth.splitJoin(data.machine);
        return this.http.post(
          this.auth.apiUrl + '/production/', data
        );
    }


    changeProduction(data: Production, id){
      this.fetchProductionBySearch(id).subscribe((object)=>{
        let oldValues = ""+JSON.stringify(object);
        this.auth.logChanges(oldValues, this.model, "Update", id).subscribe();
      })
      data.machine = this.auth.splitJoin(data.machine)
        return this.http.put(
          this.auth.apiUrl + '/production/' + id + "/", data
        );
    }

    setInQuestion(data, id){
      this.fetchProductionBySearch(id).subscribe((object)=>{
        let oldValues = JSON.stringify(object);
        this.auth.logChanges(oldValues, this.model, "In Question", id).subscribe();
      })
        return this.http.put(
          this.auth.apiUrl + '/production/' + id + "/inQuestion", data
        );
    }

    deleteProduction(id){
      this.fetchProductionBySearch(id).subscribe((object)=>{
        let oldValues = JSON.stringify(object);
        this.auth.logChanges(oldValues, this.model, "Delete", id).subscribe();
      })
        return this.http.delete(this.auth.apiUrl + "/production/" + id + "/",{
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