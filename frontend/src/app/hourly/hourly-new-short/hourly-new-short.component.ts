import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DaysService } from 'src/app/shared/days/days.service';
import { HourlyService } from 'src/app/hourly/hourly.service';
import { Hourly } from '../hourly.model';

@Component({
  selector: 'app-hourly-new-short',
  templateUrl: './hourly-new-short.component.html',
  styleUrls: ['./hourly-new-short.component.css']
})
export class HourlyNewShortComponent implements OnInit {
  @Input() index: number;
  @Input() lot: Hourly;
  @Input() startTime: string;
  editHourlyForm: FormGroup;
  hourlyForm: FormGroup;
  hourly: Hourly;

  constructor(
    private dayServ: DaysService,
    private hourServ: HourlyService
  ) { }

  ngOnInit() {
    if (this.lot){
      this.setTime(this.lot);
    } else {
      this.initForm();
    }
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
    this.initEditForm();
  }


  private initEditForm() {
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

  onSubmitEdit(){
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
    this.hourServ.changeHourly(data, this.lot.id).subscribe(()=>{
      this.onCancel();
    });
  }


  private initForm() {
    let quantity: number;
    let counterQuantity: number;
    let date = this.dayServ.year +"-"+this.dayServ.stringMonth+"-"+this.dayServ.today;
    let hour = ""+this.dayServ.date.getHours();
    let minute = ""+this.dayServ.date.getMinutes();
    if (+minute <10){
      minute = "0"+minute;
    }
    if (+hour < 10){
      hour ="0"+hour;
    }
    let time = hour+":"+minute;
    
    this.hourlyForm = new FormGroup({
      'quantity': new FormControl(quantity),
      'counterQuantity': new FormControl(counterQuantity),
      'date': new FormControl(date, Validators.required),
      'time': new FormControl(time, Validators.required),
      'machine': new FormControl(this.hourServ.machine.machine, Validators.required),
      'jobNumber': new FormControl(this.hourServ.jobNumber, Validators.required),
      'opNumber': new FormControl(this.hourServ.opNumber, Validators.required),
      'startTime': new FormControl(this.hourServ.startTimes[this.index])
    });
  }

  onSubmit(){
    if (!this.hourlyForm.value.counterQuantity){
      this.hourlyForm.value.counterQuantity = null;
    }
    this.hourServ.addHourly(this.hourlyForm.value).subscribe(()=>{
      this.onCancel();
    });
  }

  onCancel(){
    this.hourServ.hourlyChanged.next();
  }

}
