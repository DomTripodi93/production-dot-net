import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MachineService } from '../../machine/machine.service';
import { Machine } from 'src/app/machine/machine.model';
import { HourlyService } from '../hourly.service';
import { DaysService } from 'src/app/shared/days/days.service';
import { Hourly } from '../hourly.model';

@Component({
  selector: 'app-hourly-new',
  templateUrl: './hourly-new.component.html',
  styleUrls: ['./hourly-new.component.css']
})
export class HourlyNewComponent implements OnInit {
  canInput= false;
  hourlyForm: FormGroup;
  machines: Machine[] = []

  constructor(
    private hourServ: HourlyService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dayServe: DaysService,
    private mach: MachineService
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    if (!this.dayServe.today){
      this.dayServe.resetDate();
    }
    this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.machines = machines;
      this.initForm();
    });
    this.auth.hideButton(0);
  }
    
  private initForm() {
    if (+this.dayServe.today < 10 && this.dayServe.today.length <2){
      this.dayServe.today = "0"+this.dayServe.today
    };
    if (+this.dayServe.month < 10 && this.dayServe.stringMonth.length <2){
      this.dayServe.stringMonth = "0"+this.dayServe.month;
    };
    let quantity: number;
    let counter_quantity: number;
    let date = this.dayServe.year +"-"+this.dayServe.stringMonth+"-"+this.dayServe.today;
    let hour = ""+this.dayServe.date.getHours();
    let minute = ""+this.dayServe.date.getMinutes();
    if (+minute <10){
      minute = "0"+minute;
    }
    if (+hour < 10){
      hour ="0"+hour;
    }
    let time = hour+":"+minute;
    let machine = ""
    if (this.machines.length > 0){
      machine = this.machines[0].machine;
    }
    let job ='';

    this.hourlyForm = new FormGroup({
      'hard_quantity': new FormControl(quantity, Validators.required),
      'counter_quantity': new FormControl(counter_quantity),
      'date': new FormControl(date, Validators.required),
      'time': new FormControl(time, Validators.required),
      'machine': new FormControl(machine, Validators.required),
      'job': new FormControl(job, Validators.required)
    });
  }
  
  onSubmit(){
    if (!this.hourlyForm.value.counter_quantity){
      this.hourlyForm.value.counter_quantity = null;
    }
    this.newHourly(this.hourlyForm.value);
  }

  newHourly(data: Hourly) {
    this.hourServ.addHourly(data).subscribe();
    setTimeout(()=>{
      this.router.navigate([".."], {relativeTo: this.route});
    },10)
  }

  onCancel(){
    window.history.back();
  }

  ngOnDestroy(){
    this.auth.showButton(0);
  }


}