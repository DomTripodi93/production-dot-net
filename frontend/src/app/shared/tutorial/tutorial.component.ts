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
  lathes = false;
  mills = false;
  latheParts = false;
  millParts = false;
  latheJobs = false;
  millJobs = false;
  latheOps = false;
  millOps = false;
  hourly = false;
  latheProduction = false;  
  latheProductionMulti = false;  
  millProduction = false;  
  complete = false;
  millJob = "";
  latheJob = "";
  op = "";
  checking = "";
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
    this.setBase();
    this.checkMachines();
    //Checks if user has created any machines, and starts a chain 
    // reaction to check subsequent model creations to initially set
    // tutorial display option
    this.subscriptions.push(this.auth.authChanged.subscribe(()=>{
      this.setBase();
      this.checkMachines();
    }))
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
      setTimeout(()=>{this.checkJobs();},50)}
    ));
    this.subscriptions.push(this.hourlyServ.hourlyChanged.subscribe(()=>{
      setTimeout(()=>{this.checkHourly();},50)}
    ));
    this.subscriptions.push(this.prodServ.proChanged.subscribe(()=>{
      setTimeout(()=>{this.checkJobs();},50)}
    ));
  }

  setBase(){
    this.lathes = false;
    this.mills = false;
    this.latheParts = false;
    this.millParts = false;
    this.latheJobs = false;
    this.millJobs = false;
    this.latheOps = false;
    this.millOps = false;
    this.hourly = false;
    this.latheProduction = false;  
    this.latheProductionMulti = false;  
    this.millProduction = false;  
    this.complete = false;
    this.millJob = "";
    this.latheJob = "";
    this.op = "";
    this.checking = "";
    if (this.auth.skipLathe){
      this.lathes = true;
      this.hourly = true;
      this.latheJobs = true;
      this.latheOps = true;
      this.latheParts = true;
      this.latheProduction = true;
      this.latheProductionMulti = true;
      this.checking = "mill"
    } else if (this.auth.skipMill){
      this.mills = true;
      this.millJobs = true;
      this.millOps = true;
      this.millParts = true;
      this.millProduction = true;
      this.checking = "lathe"
    } else {
      this.checking = "lathe"
    }
  }

  checkMachines(){
    this.mach.fetchMachinesByType(this.checking)
      .subscribe(machine => {
        if (machine.length > 0){
          if (this.checking == "lathe"){
            this.lathes = true;
            this.checkParts();
          } else {
            this.mills = true;
            this.checkParts();
          }
        } else if (this.checking == "lathe" && !this.auth.skipLathe){
          this.lathes = false;
        } else if (!this.auth.skipMill) {
          this.mills = false;
        }
      }
    );
  }
  //Checks if user has created any Machines, and if they have, moves
  // to check the next relevant model, parts

  checkParts(){
    this.partServ.fetchPartsByType(this.checking)
      .subscribe(part => {
        if (part.length > 0){
          if (this.checking == "lathe"){
            this.latheParts = true;
            this.checkJobs();
          } else {
            this.millParts = true;
            this.checkJobs();
          }
        } else if (this.checking == "lathe" && !this.auth.skipLathe){
          this.latheParts = false;
        } else if (!this.auth.skipMill) {
          this.millParts = false;
        }
      }
    );
  }
  //Checks if user has created any Parts, and if they have, moves
  // to check the next relevant Model, Jobs

  checkJobs(){
    this.jobServ.fetchJobsByType(1, 6, this.checking)
      .subscribe(jobs => {
        if (jobs.result.length > 0){
          if (this.checking == "lathe"){
            this.latheJob = jobs.result[0].jobNumber;
            this.latheJobs = true;
            this.checkLatheOps();
          } else {
            this.millJob = jobs.result[0].jobNumber;
            this.millJobs = true;
            this.checkMillOps();
          }
        } else if (this.checking == "lathe" && !this.auth.skipLathe){
          this.latheJobs = false;
        } else if (!this.auth.skipMill) {
          this.millJobs = false;
        }
      }
    )
  }
  //Checks if user has created any Jobs, and if they have, moves
  // to check the next relevant model, Ops, also sets job number
  // for multiple production lots link

  checkLatheOps(){
    this.opServ.fetchOpByJob(this.latheJob)
      .subscribe(ops => {
        if (ops.length > 0){
          this.latheOps = true;
          if (ops[0].opNumber.includes("/")){
            this.op = this.opServ.slashToDash(ops[0].opNumber);
          } else {
            this.op = ops[0].opNumber;
          }
          this.checkHourly();
        } else {
          this.latheOps = false;
        } 
      }
    )
  }
  //Checks if user has created any Ops, and if they have, moves
  // to check the next relevant model, Hourly, also sets op number
  // for multiple production lots link

  checkMillOps(){
    this.opServ.fetchOpByJob(this.millJob)
      .subscribe(ops => {
        if (ops.length > 0){
          this.millOps = true;
          this.checkProduction();
        } else {
          this.millOps = false;
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
        } else {
          this.hourly = false;
        }
      }
    );
  }
  //Checks if user has created any Hourly lots, and if they have, moves
  // to check the next relevant model, Production

  checkProduction(){
    if (this.checking == "lathe"){
      this.prodServ.fetchAllProduction()
        .subscribe(prod => {
        if (prod.length > 0){
          if (prod.length > 1){
            this.latheProductionMulti = true;
            this.checkMachines();
          } else {
            this.latheProductionMulti = false;
          }
          this.latheProduction = true;
          this.op = this.opServ.slashToDash(prod[0].opNumber);
          } else {
            this.latheProduction = false;
          } 
        }
      );
    } else {
      this.opServ.fetchOpByJob(this.millJob)
        .subscribe(ops => {
          ops.forEach(op=>{
            if (+op.partsToDate > 0){
              this.millProduction = true;
              this.complete = true;
            } else {
              this.millProduction = false;
              this.complete = false;
            }
          })
        }
      );
    }
  }
  //Checks if user has created any Production Lots

  notNew() {
    if (confirm("Are you sure you want to hide these tutorials?")){
      this.auth.changeNew();
    }
  }
  //Confirms hiding of tutorials, and sets user settings for tutorial 
  // view on confirmation

  switchLathe(force?: boolean) {
    if (force){
      this.auth.changeLathe();
      this.latheProductionMulti = true;
    } else if (!this.auth.skipLathe){
      if (confirm("Are you sure you want to hide lathe tutorials?")){
        this.auth.changeLathe();
        this.latheProductionMulti = true;
      }
    }
  }
  //Confirms decision to change Lathe Tutorial activation status, and sends 
  // change data to backend API

  switchMill() {
    if (!this.auth.skipMill){
      if (confirm("Are you sure you want to hide mill tutorials?")){
        this.auth.changeMill();
        this.millProduction = true;
      }
    } 
  }
  //Confirms decision to change Mill Tutorial activation status, and sends 
  // change data to backend API

  changeToMill(){
    this.checking = "mill";
    this.switchLathe(true);
  }

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe()
    });
  }
}
