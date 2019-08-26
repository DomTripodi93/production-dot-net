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
  hourlyForm: FormGroup;

  constructor(
    private dayServ: DaysService,
    private hourServ: HourlyService
  ) { }

  ngOnInit() {
    this.initForm()
  }


  private initForm() {
    let quantity: number;
    let counter_quantity: number;
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
      'hard_quantity': new FormControl(quantity),
      'counter_quantity': new FormControl(counter_quantity),
      'date': new FormControl(date, Validators.required),
      'time': new FormControl(time, Validators.required),
      'machine': new FormControl(this.hourServ.machine.machine, Validators.required),
      'job': new FormControl(this.hourServ.job, Validators.required)
    });
  }

  onSubmit(){
    if (!this.hourlyForm.value.counter_quantity){
      this.hourlyForm.value.counter_quantity = null;
    }
    this.hourServ.addHourly(this.hourlyForm.value).subscribe(()=>{
      this.hourServ.hourlyChanged.next()
    });
    this.onCancel()
  }

  onCancel(){
    this.hourServ.quick[this.index]=false;
  }


}
