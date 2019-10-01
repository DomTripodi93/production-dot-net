import { Component, OnInit, Input } from '@angular/core';
import { HourlyService } from 'src/app/hourly/hourly.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DaysService } from '../../shared/days/days.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-hourly-set-time',
  templateUrl: './hourly-set-time.component.html',
  styleUrls: ['./hourly-set-time.component.css']
})
export class HourlySetTimeComponent implements OnInit {
  @Input() index: number;
  @Input() machName: string;
  hourlyForm: FormGroup;

  constructor(
    private hourServ: HourlyService,
    private dayServ: DaysService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    let startTime: string;
    if (this.hourServ.editMode[this.index]){
      let date = this.dayServ.stringMonth+"-"+this.dayServ.today+"-"+this.dayServ.year;
      this.hourServ.fetchHourly("date="+date+"&"+"machine="+this.auth.splitJoin(this.machName)).subscribe(
        hourly => {
          this.hourlyForm = new FormGroup({
            'startTime': new FormControl(hourly[0].startTime, Validators.required)
          });
        }
      );
    } else {
      startTime = "07:45";
      this.hourlyForm = new FormGroup({
        'startTime': new FormControl(startTime, Validators.required)
      });
    }
  }

  onSubmit(){
    let date = this.dayServ.stringMonth+"-"+this.dayServ.today+"-"+this.dayServ.year;
    this.hourServ.fetchHourly("date="+date+"&"+"machine="+this.auth.splitJoin(this.machName)).subscribe(
      hourly => {
        hourly.forEach((lot) =>{
          this.hourServ.changeStartTime(this.hourlyForm.value, lot.id).subscribe(()=>{
            this.hourServ.hourlyChanged.next();
          });
        });
      }
    );
    this.onCancel();
  }

  onCancel(){
    this.hourServ.quick[this.index]=false;
    this.hourServ.setTime[this.index]=false;
  }

}
