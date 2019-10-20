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
    //Checks if user has created any machines, and starts a chain 
    // reaction to check subsequent model creations to initially set
    // tutorial display option
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
  //Checks if user has created any Machines, and if they have, moves
  // to check the next relevant model, parts

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
  //Checks if user has created any Parts, and if they have, moves
  // to check the next relevant Model, Jobs

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
  //Checks if user has created any Jobs, and if they have, moves
  // to check the next relevant model, Ops, also sets job number
  // for multiple production lots link

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
  //Checks if user has created any Ops, and if they have, moves
  // to check the next relevant model, Hourly, also sets op number
  // for multiple production lots link

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
  //Checks if user has created any Hourly lots, and if they have, moves
  // to check the next relevant model, Production

  checkProduction(){
    this.prodServ.fetchAllProduction()
      .subscribe(prod => {
        if (prod.length > 0){
          this.production = true;
        }
      }
    )
  }
  //Checks if user has created any Production Lots

  notNew() {
    if (confirm("Are you sure you want to hide these tutorials?")){
      this.auth.changeNew();
    }
  }
  //Confirms hiding of tutorials, and sets user settings for tutorial 
  // view on confirmation

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe()
    });
  }
}
