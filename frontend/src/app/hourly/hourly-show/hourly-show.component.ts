import { Component, OnInit, OnDestroy } from '@angular/core';
import { DaysService } from '../../shared/days/days.service';
import { Hourly } from '../hourly.model';
import { Subscription } from 'rxjs';
import { HourlyService } from '../hourly.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MachineService } from 'src/app/machine/machine.service';
import { Machine } from 'src/app/machine/machine.model';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-hourly-show',
  templateUrl: './hourly-show.component.html',
  styleUrls: ['./hourly-show.component.css']
})
export class HourlyShowComponent implements OnInit, OnDestroy {
  hourly: Hourly[] = [];
  hourlyHold: Hourly[]=[];
  splitLots: Hourly[][]=[];
  lastMachine ="";
  subscriptions: Subscription[]=[];
  isFetching = false;
  isError = false;
  error = '';
  machines: Machine[] = [];
  jobNumber="";
  nothing = [];


  constructor(
    private hourServ: HourlyService,
    private dayServ: DaysService,
    private mach: MachineService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.dayServ.resetDate();
    this.getMachines();
    this.subscriptions.push(this.hourServ.hourlyChanged.subscribe(()=>{
      setTimeout(()=>{this.getMachines()},50)}
    ))
  }

  quickInput(index){
    this.hourServ.jobNumber = this.machines[index].currentJob;
    this.hourServ.opNumber = this.machines[index].currentOp;
    this.hourServ.machine = this.machines[index];
    this.hourServ.quick[index] = true;
  }

  quickPlus(index){
    this.hourServ.isJob[index] = true
    this.quickInput(index);
  }

  quickTime(index){
    this.hourServ.setTime[index] = true
    this.quickInput(index);
  }

  quickTimeEdit(index){
    this.hourServ.editMode[index] = true;
    this.hourServ.setTime[index] = true
    this.quickInput(index);
  }

  getMachines(){
    this.subscriptions.push(this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.hourServ.isJob = [];
      this.hourServ.setTime = [];
      this.hourServ.canSetTime = [];
      this.hourServ.quick = [];
      this.hourServ.noStart = [];
      this.hourServ.editMode = [];
      for (let i in machines){
        this.hourServ.isJob.push(false);
        this.hourServ.setTime.push(false);
        this.hourServ.canSetTime.push(false);
        this.hourServ.quick.push(false);
        this.hourServ.noStart.push(true);
        this.hourServ.editMode.push(false);
        this.hourServ.startTimes.push("")
      }
      this.machines = machines;
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    }));
  }

  newHourly(i) {
    this.hourServ.quick[i]=false;
  }

  onCancel(i){
    this.hourServ.quick[i]=false;
  }

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{sub.unsubscribe()})
  }


}