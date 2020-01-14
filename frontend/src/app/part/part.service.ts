import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Part } from './part.model';
import { Active } from '../shared/active.model';

@Injectable({providedIn: 'root'})
export class PartService {
  partChanged = new Subject();
  partUpdated = new Subject();
  partHold: Part;
  model = "Part";
  onlyActive = true;

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
        const partHold: Part [] = responseData;
      return partHold;
      })
    )
  }


  fetchPartsByType(type?) {
    let mach = "";
    if (type){
      mach = type;
    } else {
      mach = this.auth.machType;
    }
    return this.http.get(
      this.auth.apiUrl + '/part/type=' + mach
    )
    .pipe(
      map((responseData: Part[]) => {
        const partHold: Part [] = responseData;
      return partHold;
      })
    )
  }

  fetchAllPartsByType() {
    return this.http.get(
      this.auth.apiUrl + '/part/all&type=' + this.auth.machType
    )
    .pipe(
      map((responseData: Part[]) => {
        const partHold: Part [] = responseData;
      return partHold;
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

  changeActive(data: Active, partNum){
    this.fetchPart(partNum).subscribe((object)=>{
      let oldValues = ""+JSON.stringify(object);
      this.auth.logChanges(oldValues, this.model, "Update", partNum).subscribe();
    })
      return this.http.put(
        this.auth.apiUrl + '/part/active&' + partNum + "/", data
      );
  }

}