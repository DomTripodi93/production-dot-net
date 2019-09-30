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
  date = "";
  nothing = [];
  isJob: boolean[] = [];
  setTime: boolean[] = [];
  noStart: boolean = true;


  constructor(
    private hourServ: HourlyService,
    private dayServ: DaysService,
    private mach: MachineService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.date = this.dayServ.stringMonth+"-"+this.dayServ.today+"-"+this.dayServ.year
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
    this.isJob[index] = true
    this.quickInput(index);
  }

  quickTime(index){
    this.setTime[index] = true
    this.quickInput(index);
  }

  getMachines(){
    this.subscriptions.push(this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.isJob = [];
      this.setTime = []
      this.hourServ.quick = [];
      for (let i in machines){
        this.isJob.push(false);
        this.setTime.push(false);
        this.hourServ.quick.push(false)  
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