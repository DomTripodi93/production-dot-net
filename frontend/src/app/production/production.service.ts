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
          if (+part.remaining_quantity > 0){
            let value = +part.remaining_quantity - data.quantity;
            if (value >= 0){
              part.remaining_quantity = "" + value;
            } else {
              part.remaining_quantity = "0"
            }
          } else if (!part.remaining_quantity && part.possible_quantity){
            let value = +part.possible_quantity - data.quantity;
            part.remaining_quantity = "" + value;
          } else if (!part.remaining_quantity && part.order_quantity){
            let value = +part.order_quantity - data.quantity;
            part.remaining_quantity = "" + value;
          } else if (!part.remaining_quantity && part.weight_quantity){
            let value = +part.weight_quantity - data.quantity;
            part.remaining_quantity = "" + value;
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
        let old_values = ""+JSON.stringify(object);
        this.auth.logChanges(old_values, this.model, "Update", id).subscribe();
      })
      data.machine = this.auth.splitJoin(data.machine)
        return this.http.put(
          this.auth.apiUrl + '/production/' + id + "/", data
        );
    }

    setInQuestion(data, id){
      this.fetchProductionById(id).subscribe((object)=>{
        let old_values = JSON.stringify(object);
        this.auth.logChanges(old_values, this.model, "In Question", id).subscribe();
      })
        return this.http.patch(
          this.auth.apiUrl + '/production/' + id + "/", data
        );
    }

    deleteProduction(id){
      this.fetchProductionById(id).subscribe((object)=>{
        let old_values = JSON.stringify(object);
        this.auth.logChanges(old_values, this.model, "Delete", id).subscribe();
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