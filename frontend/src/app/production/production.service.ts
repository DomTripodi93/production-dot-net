import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Production } from './production.model';
import { PartService } from 'src/app/part/part.service';
import { Part } from '../part/part.model';

@Injectable({providedIn: 'root'})
export class ProductionService {
    proChanged = new Subject();
    model = "Production"

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private partServ: PartService
        ) {}

    fetchProduction(search) {
        return this.http.get(
          this.auth.apiUrl + '/production/?' + search
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

    fetchProductionById(id) {
        return this.http.get(
          this.auth.apiUrl + '/production/' + id + "/"
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
      this.partServ.fetchPart("job=" + data.job).subscribe((parts: Part[])=>{
        parts.forEach((part)=>{
          if (+part.remainingQuantity > 0){
            let value = +part.remainingQuantity - data.quantity;
            if (value >= 0){
              part.remainingQuantity = "" + value;
            } else {
              part.remainingQuantity = "0"
            }
          } else if (!part.remainingQuantity && part.possibleQuantity){
            let value = +part.possibleQuantity - data.quantity;
            part.remainingQuantity = "" + value;
          } else if (!part.remainingQuantity && part.orderQuantity){
            let value = +part.orderQuantity - data.quantity;
            part.remainingQuantity = "" + value;
          } else if (!part.remainingQuantity && part.weightQuantity){
            let value = +part.weightQuantity - data.quantity;
            part.remainingQuantity = "" + value;
          }
          this.partServ.changePart(part, part.id).subscribe()
        })
      })
      data.machine = this.auth.splitJoin(data.machine);
        return this.http.post(
          this.auth.apiUrl + '/production/', data
        );
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
        return this.http.patch(
          this.auth.apiUrl + '/production/' + id + "/", data
        );
    }

    deleteProduction(id){
      this.fetchProductionById(id).subscribe((object)=>{
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