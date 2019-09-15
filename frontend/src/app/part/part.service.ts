import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Part } from './part.model';

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
          this.auth.apiUrl + '/part/' + search
        )
        .pipe(
          map((responseData: Part) => {
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
            const proHold: Part [] = responseData;
          return proHold;
          })
        )
      }

    addPart(data: Part){
        return this.http.post(
          this.auth.apiUrl + '/part/', data
        );
    }

    changePart(data: Part, id){
      this.fetchPart(id).subscribe((object)=>{
        let oldValues = ""+JSON.stringify(object);
        this.auth.logChanges(oldValues, this.model, "Update", id).subscribe();
      });
        return this.http.put(
          this.auth.apiUrl + '/part/' + id + "/", data
        );
    }

    deletePart(id){
      this.fetchPart(id).subscribe((object)=>{
        let oldValues = ""+JSON.stringify(object);
        this.auth.logChanges(oldValues, this.model, "Delete", id).subscribe();
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