import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject, Observable } from 'rxjs';
import { Job } from './job.model';
import { PaginatedResult } from '../shared/pagination';
import { Active } from '../shared/active.model';

@Injectable({providedIn: 'root'})
export class JobService {
  jobChanged = new Subject();
  jobHold: Job;
  jobsHold: Job[];
  model = "Job";
  onlyActive = true;

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

  fetchJobsByType(page?, itemsPerPage?, type?): Observable<PaginatedResult<Job[]>>{
    let mach = "";
    if (type){
      mach = type;
    } else {
      mach = this.auth.machType;
    }
    const paginatedResult: PaginatedResult<Job[]> = new PaginatedResult<Job[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null){
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }

      return this.http.get(
        this.auth.apiUrl + '/job/type=' + mach, {observe: "response", params}
      )
      .pipe(
        map((responseData: any) => {
          paginatedResult.result = responseData.body;
          if (responseData.headers.get("Pagination") != null){
            paginatedResult.pagination = JSON.parse(responseData.headers.get("Pagination"));
          }
            return paginatedResult;
        })
      )
  }

  fetchAllJobsByType(page?, itemsPerPage?): Observable<PaginatedResult<Job[]>> {
    const paginatedResult: PaginatedResult<Job[]> = new PaginatedResult<Job[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null){
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }

      return this.http.get(
        this.auth.apiUrl + '/job/all&type=' + this.auth.machType, {observe: "response", params}
      )
      .pipe(
        map((responseData: any) => {
          paginatedResult.result = responseData.body;
          if (responseData.headers.get("Pagination") != null){
            paginatedResult.pagination = JSON.parse(responseData.headers.get("Pagination"));
          }
            return paginatedResult;
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

  changeJobRemaining(data, jobNum){
    this.fetchJob(jobNum).subscribe((object)=>{
      let oldValues = ""+JSON.stringify(object);
      this.auth.logChanges(oldValues, this.model, "Update", jobNum).subscribe();
    })
      return this.http.put(
        this.auth.apiUrl + '/job/remaining/' + jobNum + "/", data
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

  changeActive(data: Active, jobNum){
    this.fetchJob(jobNum).subscribe((object)=>{
      let oldValues = ""+JSON.stringify(object);
      this.auth.logChanges(oldValues, this.model, "Update", jobNum).subscribe();
    })
      return this.http.put(
        this.auth.apiUrl + '/job/active&' + jobNum + "/", data
      );
  }
        
}