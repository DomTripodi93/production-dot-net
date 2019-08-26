import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Part } from './part.model';
import { Change } from '../shared/change.model';

@Injectable({providedIn: 'root'})
export class PartService {
    partChanged = new Subject();
    partHold: Part;
    model = "Part";

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {}


    holdPart(part: Part){
      this.partHold = part;
    }

    fetchPart(search) {
        return this.http.get(
          this.auth.apiUrl + '/part/?' + search
        )
        .pipe(
          map((responseData: Part[]) => {
            const partHold: Part[] = [];
            responseData.forEach((lot)=>{
              lot.machine = this.auth.rejoin(lot.machine);
              partHold.push(lot)
            })
          return partHold;
          })
        )
    } 

    fetchPartById(id) {
        return this.http.get(
          this.auth.apiUrl + '/part/' + id + "/"
        )
        .pipe(
          map((responseData: Part) => {
            responseData.machine = this.auth.rejoin(responseData.machine);
          return responseData;
          })
        )
    } 
  
    fetchAllParts() {
        return this.http.get(
          this.auth.apiUrl + '/part/'
        )
        .pipe(
          map((responseData: Part[]) => {
            responseData.forEach((lot)=>{
              lot.machine = this.auth.rejoin(lot.machine);
            })
            const proHold: Part [] = responseData;
          return proHold;
          })
        )
      }

      addPart(data: Part){
        Object.keys(data).forEach(value => {
          if (data[value] === ""){
            data[value] = null
          }          
        });
        data.machine = this.auth.splitJoin(data.machine);
          return this.http.post(
            this.auth.apiUrl + '/part/', data
          );
      }

      changePart(data: Part, id){
        this.fetchPartById(id).subscribe((object)=>{
          let old_values = ""+JSON.stringify(object);
          this.auth.logChanges(old_values, this.model, "Update", id).subscribe();
        })
        Object.keys(data).forEach(value => {
          if (data[value] === ""){
            data[value] = null
          }          
        });
        data.machine = this.auth.splitJoin(data.machine);
          return this.http.put(
            this.auth.apiUrl + '/part/' + id + "/", data
          );
      }

      deletePart(id){
        this.fetchPartById(id).subscribe((object)=>{
          let old_values = ""+JSON.stringify(object);
          this.auth.logChanges(old_values, this.model, "Delete", id).subscribe();
        })
          return this.http.delete(this.auth.apiUrl + "/part/" + id + "/",{
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