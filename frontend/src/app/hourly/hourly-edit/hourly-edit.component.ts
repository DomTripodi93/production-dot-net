import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { HourlyService } from '../hourly.service';
import { Hourly } from '../hourly.model';

@Component({
  selector: 'app-hourly-edit',
  templateUrl: './hourly-edit.component.html',
  styleUrls: ['./hourly-edit.component.css']
})
export class HourlyEditComponent implements OnInit {
  @Input() lot: Hourly;
  @Input() startTime: string;
  editHourlyForm: FormGroup;
  hourly: Hourly;
  canInput = false;
  shifts = [
    "Day",
    "Night",
    "Over-Night",
    "Found"
  ];
  
  constructor(
    private hourlyServ: HourlyService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.setTime(this.lot);
  }

  setTime(lot){
    if (lot.time[1] == ":"){
      lot.time = "0" + lot.time;
    }
    if (lot.time[6] == "P"){
      let hour = lot.time[0] + lot.time[1];
      hour = "" + (+hour + 12);
      lot.time = hour + ":" + lot.time[3] + lot.time[4];
    }
    this.initializeFromValues(lot);
  }

  initializeFromValues(lot){
    this.hourly = lot;
    this.initForm();
  }


  private initForm() {
    this.editHourlyForm = new FormGroup({
      'quantity': new FormControl(this.hourly.quantity),
      'counterQuantity': new FormControl(this.hourly.counterQuantity),
      'date': new FormControl(this.hourly.date, Validators.required),
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
          this.onCancel();
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
    this.hourlyServ.changeHourly(data, this.lot.id).subscribe(()=>{
      this.onCancel();
    });
  }

  onCancel(){
    this.hourlyServ.hourlyChanged.next();
  }

}