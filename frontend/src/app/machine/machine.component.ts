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
  ) { }

  ngOnInit(){
    this.getMachType();
  }

  getMachType(){
    this.subscriptions.push(
      this.route.params.subscribe((params: Params) => {
        this.auth.machType = params["machType"];
        this.machServ.machChanged.next();
        if (this.auth.machType == "lathe"){
          this.machServ.getJobs();
        }
      })
    );
  }
  //Gets machine type from url params, and updates machine components 
  // when it changes

  ngOnDestroy(){
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    })
  }
}
