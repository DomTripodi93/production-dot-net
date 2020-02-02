import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';
import { Machine } from './machine.model';
import { Change } from '../shared/change.model';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { JobService } from 'src/app/job/job.service';

@Injectable({providedIn: 'root'})
export class MachineService {
  machChanged = new Subject();
  machCancel = new Subject();
  model = "Machine";
  jobOp = {};
  addNew = false;
  page: number = 1;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private opServ: OpService,
    private jobServ: JobService
  ) {}

  fetchMachineByName(name) {
      return this.http.get(
        this.auth.apiUrl + '/machine/' + name + "/"
      )
      .pipe(
        map((responseData: Machine) => {
        return responseData;
        })
      )
  }
  //Gets specific machine by name

  fetchMachinesByType(type?) {
    let mach = "";
    if (type){
      mach = type;
    } else {
      mach = this.auth.machType;
    }
      return this.http.get(
        this.auth.apiUrl + '/machine/type=' + mach
      )
      .pipe(
        map((responseData: Machine[]) => {
          const machHold: Machine [] = responseData;
        return machHold;
        })
      )
  }
  //Gets machines of specific type (lathe/mill) based on current param value, 
  // or input value for tutorial checks

  addMachine(data: Machine){
      return this.http.post(
        this.auth.apiUrl + '/machine/', data
      );
  }
  //Posts new machine to API

  setCurrentJob(data, name){
    this.fetchMachineByName(name).subscribe((object)=>{
      let oldValues = ""+JSON.stringify(object);
      this.auth.logChanges(oldValues, this.model, "Change Job", name).subscribe();
    })
      return this.http.patch(
        this.auth.apiUrl + '/machine/' + name, data
      );
  }
  //Updates currentJob and currentOp valued for machine

  deleteMachine(name){
    this.fetchMachineByName(name).subscribe((object)=>{
      let oldValues = ""+JSON.stringify(object);
      this.auth.logChanges(oldValues, this.model, "Delete", name).subscribe();
    })
    return this.http.delete(this.auth.apiUrl + "/machine/" + name + "/",
    {
        observe: 'events',
        responseType: 'text'
    })
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
  //Deletes selected machine, and returns successful deletion message

  getJobs(){
    this.jobServ.fetchJobsByType(this.page, 10).subscribe(paginatedResponse =>{
      let goneThrough = 0;
      let response = paginatedResponse.result;
      let allResults = (paginatedResponse.pagination.currentPage != paginatedResponse.pagination.totalPages);
      if (response.length > 0) {
        this.jobOp["None"] = ["None"];
        response.forEach(job => {
          goneThrough += 1;
          this.getOps(job.jobNumber);
          if (response.length == goneThrough && allResults){
            this.page += 1;
            this.getJobs();
          }
        });
      } else {
        this.jobOp = {None: ["None"]}
      }
    });
  }

  getOps(job: string){
    let jobOps: string[] = [];
    this.opServ.fetchOpByJob(job).subscribe((ops)=>{
      let goneThrough = 0;
      jobOps.push("None")
      if (ops.length > 0){
        ops.forEach((op)=>{
          jobOps.push(op.opNumber);
          goneThrough += 1;
          if (ops.length == goneThrough){
            this.jobOp[job] = jobOps;
          }
        })
      } else {
        this.jobOp[job] = jobOps;
      }
    })
  }
}