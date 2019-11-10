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
  millProduction = false;  
  millJob = "";
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
    if (this.auth.skipLathe){
      this.lathes = true;
      this.hourly = true;
      this.latheJobs = true;
      this.latheOps = true;
      this.latheParts = true;
      this.latheProduction = true;
      this.auth.machType = "Mill"
    } else if (this.auth.skipMill){
      this.mills = true;
      this.millJobs = true;
      this.millOps = true;
      this.millParts = true;
      this.millProduction = true;
      this.auth.machType = "Lathe"
    } else {
      this.auth.machType = "Lathe"
    }
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
      setTimeout(()=>{this.checkLatheOps(); this.checkMillOps();},50)}
    ));
    this.subscriptions.push(this.hourlyServ.hourlyChanged.subscribe(()=>{
      setTimeout(()=>{this.checkHourly();},50)}
    ));
    this.subscriptions.push(this.prodServ.proChanged.subscribe(()=>{
      setTimeout(()=>{this.checkProduction();},50)}
    ));
  }

  checkMachines(){
    this.mach.fetchMachinesByType()
      .subscribe(machine => {
        if (machine.length > 0){
          if (this.auth.machType == "Lathe"){
            this.lathes = true;
            this.checkParts();
          } else {
            this.mills = true;
            this.checkParts();
          }
        }
      }
    );
  }
  //Checks if user has created any Machines, and if they have, moves
  // to check the next relevant model, parts

  checkParts(){
    this.partServ.fetchPartsByType()
      .subscribe(part => {
        if (part.length > 0){
          if (this.auth.machType == "Lathe"){
            this.latheParts = true;
            this.checkJobs();
          } else{
            this.millParts = true;
            this.checkJobs();
          }
        }
      }
    );
  }
  //Checks if user has created any Parts, and if they have, moves
  // to check the next relevant Model, Jobs

  checkJobs(){
    this.jobServ.fetchAllJobs()
      .subscribe(jobs => {
        if (jobs.length > 0){
          if (this.auth.machType == "Lathe"){
            this.job = jobs[0].jobNumber
            this.latheJobs = true;
            this.checkLatheOps();
          } else {
            this.millJob = jobs[0].jobNumber
            this.millJobs = true;
            this.checkMillOps();
          }
        }
      }
    )
  }
  //Checks if user has created any Jobs, and if they have, moves
  // to check the next relevant model, Ops, also sets job number
  // for multiple production lots link

  checkLatheOps(){
    this.opServ.fetchOpByJob(this.job)
      .subscribe(ops => {
        if (ops.length > 0){
          this.latheOps = true;
          if (ops[0].opNumber.includes("/")){
            this.op = this.opServ.slashToDash(ops[0].opNumber);
          } else {
            this.op = ops[0].opNumber;
          }
          this.checkHourly();
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
    if (this.auth.machType == "Lathe"){
      this.prodServ.fetchAllProduction()
        .subscribe(prod => {
        if (prod.length > 0){
            this.latheProduction = true;
            this.op = prod[0].opNumber;
            this.auth.machType = "Mill";
            this.checkMachines();
          } 
        }
      );
    } else {
      this.opServ.fetchOpByJob(this.millJob)
        .subscribe(ops => {
          ops.forEach(op=>{
            if (+op.partsToDate > 0){
              this.millProduction = true;
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

  switchLathe() {
    if (!this.auth.skipLathe){
      if (confirm("Are you sure you want to hide these tutorials?")){
        this.auth.changeLathe();
        this.latheProduction = true;
      }
    }
  }
  //Confirms decision to change Lathe Tutorial activation status, and sends 
  // change data to backend API

  switchMill() {
    if (!this.auth.skipMill){
      if (confirm("Are you sure you want to hide these tutorials?")){
        this.auth.changeMill();
        this.millProduction = true;
      }
    } 
  }
  //Confirms decision to change Mill Tutorial activation status, and sends 
  // change data to backend API

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe()
    });
  }
}
