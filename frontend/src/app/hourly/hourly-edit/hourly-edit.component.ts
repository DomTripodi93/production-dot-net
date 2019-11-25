import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { MachineService } from 'src/app/machine/machine.service';
import { AuthService } from 'src/app/shared/auth.service';
import { HourlyService } from '../hourly.service';
import { Subscription } from 'rxjs';
import { Machine } from 'src/app/machine/machine.model';
import { Hourly } from '../hourly.model';
import { DaysService } from 'src/app/shared/days/days.service';

@Component({
  selector: 'app-hourly-edit',
  templateUrl: './hourly-edit.component.html',
  styleUrls: ['./hourly-edit.component.css']
})
export class HourlyEditComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() startTime: string;
  editHourlyForm: FormGroup;
  hourly: Hourly;
  canInput = false;
  machines: Machine[] = [];
  subscriptions: Subscription[]=[];
  shifts = [
    "Day",
    "Night",
    "Over-Night",
    "Found"
  ];
  
  constructor(
    private hourlyServ: HourlyService,
    private auth: AuthService,
    private mach: MachineService,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.subscriptions.push(this.mach.fetchMachinesByType("lathe")
    .subscribe(machines => {
      this.machines = machines;
    }));
    this.subscriptions.push(this.hourlyServ.fetchHourlyById(this.id)
    .subscribe(lot => {
      let beginning = lot.date.substring(5,10);
      lot.date = beginning + "-" + lot.date.substring(0,4);
      this.hourly = lot;
      this.initForm();
    }));
  }


  private initForm() {
    this.editHourlyForm = new FormGroup({
      'quantity': new FormControl(this.hourly.quantity),
      'counterQuantity': new FormControl(this.hourly.counterQuantity),
      'date': new FormControl(this.dayServ.dateForForm(""+this.hourly.date), Validators.required),
      'time': new FormControl(this.hourly.time, Validators.required),
      'machine': new FormControl(this.hourly.machine, Validators.required),
      'jobNumber': new FormControl(this.hourly.jobNumber, Validators.required),
      'opNumber': new FormControl(this.hourly.opNumber, Validators.required),
      'startTime': new FormControl(this.startTime, Validators.required)
    });
  }

  onSubmit(){
    if (this.hourly.quantity == this.editHourlyForm.value.quantity){
      if (this.hourly.time == this.editHourlyForm.value.time){
        if (this.hourly.counterQuantity == this.editHourlyForm.value.counterQuantity){
          this.hourlyServ.hourlyChanged.next();
        } else {
          this.editHourly(this.editHourlyForm.value);
        }
      } else {
        this.editHourly(this.editHourlyForm.value);
      }
    } else {
      this.editHourly(this.editHourlyForm.value);
    }
  }

  editHourly(data: Hourly) {
    this.hourlyServ.changeHourly(data, this.id).subscribe();
    setTimeout(
      ()=>{
        this.hourlyServ.hourlyChanged.next();
      },50);
  }

  onCancel(){
    this.hourlyServ.hourlyChanged.next();
  }

  onDelete(){
    if (confirm("Are you sure you want to delete this hourly production?")){
      this.hourlyServ.deleteHourly(this.id).subscribe()
      setTimeout(()=>{
        this.hourlyServ.hourlyChanged.next();
      }, 50)
    }
  }

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe()
    });
  }

}