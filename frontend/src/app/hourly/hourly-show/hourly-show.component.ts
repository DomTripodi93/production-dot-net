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
  job="";
  avail=false;
  date = "";
  nothing = []


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
    this.hourServ.job = this.machines[index].current_job;
    this.hourServ.machine = this.machines[index];
    this.hourServ.quick[index] = true;
  }

  getMachines(){
    this.subscriptions.push(this.mach.fetchAllMachines()
    .subscribe(machines => {
      for (let i in machines){
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