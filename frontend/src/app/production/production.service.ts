import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Production } from './production.model';
import { JobService } from '../job/job.service';
import { OpService } from '../job/job-ops/operation.service';
import { DaysService } from '../shared/days/days.service';

@Injectable({providedIn: 'root'})
export class ProductionService {
  proChanged = new Subject();
  proChangedAvg = new Subject();
  proSubmit = new Subject();
  checkEdits = new Subject();
  model = "Production"
  setMach = "";
  editMach = "";
  openEdit = true;

  constructor(
      private http: HttpClient,
      private auth: AuthService,
      private jobServ: JobService,
      private opServ: OpService,
      private dayServ: DaysService
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
            data.opNumber = this.dayServ.dashToSlash(data.opNumber);
            proHold.push(data);                
          });
        return proHold;
        })
      )
  } 

  fetchProductionById(search) {
      return this.http.get(
        this.auth.apiUrl + '/production/' + search 
      )
      .pipe(
        map((responseData: Production) => {
          responseData.opNumber = this.dayServ.dashToSlash(responseData.opNumber);
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
            lot.opNumber = this.dayServ.dashToSlash(lot.opNumber);
            lot.machine = this.auth.rejoin(lot.machine);
          })
          const proHold: Production [] = responseData;
        return proHold;
        })
      )
  } 

  fetchProductionByType() {
      return this.http.get(
        this.auth.apiUrl + '/production/type=' + this.auth.machType
      )
      .pipe(
        map((responseData: Production[]) => {
          responseData.forEach((lot)=>{
            lot.opNumber = this.dayServ.dashToSlash(lot.opNumber);
            lot.machine = this.auth.rejoin(lot.machine);
          })
          const proHold: Production [] = responseData;
        return proHold;
        })
      )
    }

  addProduction(data: Production){
    let search = this.opServ.slashToDash(data.opNumber) + "&job=" + data.jobNumber;
    this.opServ.fetchOp(search).subscribe((op)=>{
      if (+op.remainingQuantity > 0){
        let value = +op.remainingQuantity - data.quantity;
        if (value >= 0){
          let setValue = {remainingQuantity: "" + value};
          this.opServ.changeOpRemaining(setValue, search).subscribe(()=>{
            this.changeJobInfo(data.jobNumber);
          });
        } else {
          let setValue = {remainingQuantity: "" + 0};
          this.opServ.changeOpRemaining(setValue, search).subscribe(()=>{
            this.changeJobInfo(data.jobNumber);
          });
        }
      }
    })
    data.machine = this.auth.splitJoin(data.machine);
    data.opNumber = this.opServ.slashToDash(data.opNumber);
      return this.http.post(
        this.auth.apiUrl + '/production/', data
      );
  }

  changeJobInfo(jobNum){
    this.opServ.fetchOpByJob(jobNum).subscribe((ops)=>{
      let remaining: number = 0;
      let opsUsed: number = 1;
      ops.forEach((op)=>{
        if (+op.remainingQuantity > remaining){
          remaining = +op.remainingQuantity;
          if (opsUsed == ops.length){
            this.jobServ.fetchJob(jobNum).subscribe((job)=>{
              job.deliveryDate = this.dayServ.dateForForm(job.deliveryDate);
              job.remainingQuantity = "" + remaining;
              this.jobServ.changeJob(job, jobNum).subscribe();
            })
          }
        } else if (opsUsed == ops.length){
          this.jobServ.fetchJob(jobNum).subscribe((job)=>{
            job.deliveryDate = this.dayServ.dateForForm(job.deliveryDate);
            job.remainingQuantity = "" + remaining;
            this.jobServ.changeJob(job, jobNum).subscribe();
          })
        }
        opsUsed++
      });
    })
  }

  changeProduction(data: Production, id){
    this.fetchProductionById(id).subscribe((object)=>{
      let oldValues = ""+JSON.stringify(object);
      this.auth.logChanges(oldValues, this.model, "Update", id).subscribe();
    })
    data.machine = this.auth.splitJoin(data.machine)
      return this.http.put(
        this.auth.apiUrl + '/production/' + id + "/", data
      );
  }

  setInQuestion(data, id){
    this.fetchProductionById(id).subscribe((object)=>{
      let oldValues = JSON.stringify(object);
      this.auth.logChanges(oldValues, this.model, "In Question", id).subscribe();
    })
      return this.http.put(
        this.auth.apiUrl + "/production/inQuestion/" + id, data
      );
  }

  setAverage(data, id){
    this.fetchProductionById(id).subscribe((object)=>{
      let oldValues = JSON.stringify(object);
      this.auth.logChanges(oldValues, this.model, "Average", id).subscribe();
    })
      return this.http.put(
        this.auth.apiUrl + "/production/average/" + id, data
      );
  }

  setQuantity(data, id){
    this.fetchProductionById(id).subscribe((object)=>{
      let oldValues = JSON.stringify(object);
      this.auth.logChanges(oldValues, this.model, "Average", id).subscribe();
    })
      return this.http.put(
        this.auth.apiUrl + "/production/quantity/" + id, data
      );
  }

  deleteProduction(id){
    this.fetchProductionById(id).subscribe((object)=>{
      let oldValues = JSON.stringify(object);
      this.auth.logChanges(oldValues, this.model, "Delete", id).subscribe();
    })
      return this.http.delete(this.auth.apiUrl + "/production/" + id,{
        observe: 'events',
        responseType: 'text'
        }
      )
  }
}