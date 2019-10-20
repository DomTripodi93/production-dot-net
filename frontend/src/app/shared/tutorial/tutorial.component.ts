import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { MachineService } from '../../machine/machine.service';
import { PartService } from 'src/app/part/part.service';
import { HourlyService } from '../../hourly/hourly.service';
import { ProductionService } from '../../production/production.service';
import { Subscription } from 'rxjs';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { JobService } from '../../job/job.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit, OnDestroy {
  machines = false;
  parts = false;
  jobs = false;
  ops = false;
  hourly = false;
  production = false;  
  job = "";
  op = "";
  subscriptions: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private mach: MachineService,
    private partServ: PartService,
    private hourlyServ: HourlyService,
    private prodServ: ProductionService,
    private opServ: OpService,
    private jobServ: JobService
  ) { }

  ngOnInit() {
    this.checkMachines();
    this.subscriptions.push(this.mach.machChanged.subscribe(()=>{
      setTimeout(()=>{this.checkMachines();},50)}
    ));
    this.subscriptions.push(this.partServ.partChanged.subscribe(()=>{
      setTimeout(()=>{this.checkParts();},50)}
    ));
    this.subscriptions.push(this.jobServ.jobChanged.subscribe(()=>{
      setTimeout(()=>{this.checkJobs();},50)}
    ));
    this.subscriptions.push(this.opServ.opsChanged.subscribe(()=>{
      setTimeout(()=>{this.checkOps();},50)}
    ));
    this.subscriptions.push(this.hourlyServ.hourlyChanged.subscribe(()=>{
      setTimeout(()=>{this.checkHourly();},50)}
    ));
    this.subscriptions.push(this.prodServ.proChanged.subscribe(()=>{
      setTimeout(()=>{this.checkProduction();},50)}
    ));
  }

  checkAll(){
    this.checkMachines();
    this.checkParts();
    this.checkJobs();
    this.checkOps();
    this.checkHourly();
    this.checkProduction();
  }

  checkMachines(){
    this.mach.fetchAllMachines()
      .subscribe(machine => {
        if (machine.length > 0){
          this.checkParts();
          this.machines = true;
        }
      }
    );
  }

  checkParts(){
    this.partServ.fetchAllParts()
      .subscribe(part => {
        if (part.length > 0){
          this.checkJobs();
          this.parts = true;
        }
      }
    );
  }

  checkJobs(){
    this.jobServ.fetchAllJobs()
      .subscribe(paginatedJobs => {
        let jobSet = paginatedJobs.result;
        if (jobSet.length > 0){
          this.job = jobSet[0].jobNumber
          this.jobs = true;
          this.checkOps();
        }
      }
    )
  }

  checkOps(){
    this.opServ.fetchOpByJob(this.job)
      .subscribe(ops => {
        if (ops.length > 0){
          this.checkHourly();
          this.op = ops[0].opNumber;
          if (this.op.includes("/")){
            this.op = this.opServ.slashToDash(this.op);
          }
          this.ops = true;
        }
      }
    )
  }

  checkHourly(){
    this.hourlyServ.fetchAllHourly()
      .subscribe(hour => {
        if (hour){
          this.checkProduction();
          this.hourly = true;
        }
      }
    );
  }

  checkProduction(){
    this.prodServ.fetchAllProduction()
      .subscribe(prod => {
        if (prod.length > 0){
          this.job = prod[0].jobNumber
          this.production = true;
        }
      }
    )
  }

  notNew() {
    if (confirm("Are you sure you want to hide these tutorials?")){
      this.auth.changeNew();
    }
  }

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe()
    });
  }
}
