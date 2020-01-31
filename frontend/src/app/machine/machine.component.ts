import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { MachineService } from './machine.service';
import { JobService } from 'src/app/job/job.service';
import { OpService } from 'src/app/job/job-ops/operation.service';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class MachineComponent implements OnInit, OnDestroy{
  subscriptions: Subscription[] = [];
  page = 1;

  constructor(
    public auth: AuthService,
    private machServ: MachineService,
    private route: ActivatedRoute,
    private jobServ: JobService,
    private opServ: OpService
  ) { }

  ngOnInit(){
    this.getMachType();
  }

  getMachType(){
    this.subscriptions.push(
      this.route.params.subscribe((params: Params) => {
        this.auth.machType = params["machType"];
        this.machServ.machChanged.next();
        this.getJobs();
      })
    );
  }
  //Gets machine type from url params, and updates machine components 
  // when it changes

  getJobs(){
    this.jobServ.fetchJobsByType(this.page, 10).subscribe(paginatedResponse =>{
      let goneThrough = 0;
      let response = paginatedResponse.result;
      let allResults = (paginatedResponse.pagination.currentPage != paginatedResponse.pagination.totalPages);
      if (response.length > 0) {
        this.machServ.jobOp["None"] = ["None"];
        response.forEach(job => {
          goneThrough += 1;
          this.getOps(job.jobNumber);
          if (response.length == goneThrough && allResults){
            this.page += 1;
            this.getJobs();
          }
        });
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
            this.machServ.jobOp[job] = jobOps;
          }
        })
      } else {
        this.machServ.jobOp[job] = jobOps;
      }
    })
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    })
  }
}
