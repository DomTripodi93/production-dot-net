import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Job } from './job.model';

@Injectable({providedIn: 'root'})
export class JobService {
    jobChanged = new Subject();
    jobHold: Job;
    jobsHold: Job[];
    model = "Job";

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {}

    fetchJob(search) {
      return this.http.get(
        this.auth.apiUrl + '/job/' + search
      )
      .pipe(
        map((responseData: Job) => {
        return responseData;
        })
      )
    } 

    fetchJobByPart(search) {
      return this.http.get(
        this.auth.apiUrl + '/job/' + search
      )
      .pipe(
        map((responseData: Job[]) => {
        return responseData;
        })
      )
    } 
  
    fetchAllJobs() {
      return this.http.get(
        this.auth.apiUrl + '/job/'
      )
      .pipe(
        map((responseData: Job[]) => {
        return responseData;
        })
      )
    }

    addJob(data: Job){
      return this.http.post(
        this.auth.apiUrl + '/job/', data
      );
    }

    changeJob(data: Job, jobNum){
      this.fetchJob(jobNum).subscribe((object)=>{
        let oldValues = ""+JSON.stringify(object);
        this.auth.logChanges(oldValues, this.model, "Update", jobNum).subscribe();
      })
        return this.http.put(
          this.auth.apiUrl + '/job/' + jobNum + "/", data
        );
    }

    deleteJob(jobNum){
      this.fetchJob(jobNum).subscribe((object)=>{
        let oldValues = ""+JSON.stringify(object);
        this.auth.logChanges(oldValues, this.model, "Delete", jobNum).subscribe();
      })
        return this.http.delete(this.auth.apiUrl + "/job/" + jobNum + "/",{
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