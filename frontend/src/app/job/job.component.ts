import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { JobService } from './job.service';
import { MachineService } from 'src/app/machine/machine.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    public auth: AuthService,
    public jobServ: JobService,
    private route: ActivatedRoute,
    private machServ: MachineService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe((params: Params) => {
        this.auth.machType = params["machType"];
        this.setMachines(params["machType"]);
        this.jobServ.jobChanged.next()
      })
    ) 
  }

  setMachines(type: string){
    this.machServ.fetchMachinesByType(type).subscribe(machines =>{
      this.jobServ.machines = machines;
    })
  }

  switchActive(){
    this.jobServ.onlyActive = !this.jobServ.onlyActive;
    this.jobServ.jobChanged.next();
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    })
  }

}
