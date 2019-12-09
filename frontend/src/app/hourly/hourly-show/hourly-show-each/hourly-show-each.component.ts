import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Hourly } from 'src/app/hourly/hourly.model';
import { Subscription } from 'rxjs';
import { HourlyService } from 'src/app/hourly/hourly.service';
import { DaysService } from '../../../shared/days/days.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Machine } from 'src/app/machine/machine.model';
import { OpService } from 'src/app/job/job-ops/operation.service';

@Component({
  selector: 'app-hourly-show-each',
  templateUrl: './hourly-show-each.component.html',
  styleUrls: ['./hourly-show-each.component.css']
})
export class HourlyShowEachComponent implements OnInit, OnDestroy {
  @Input() machine: Machine;
  @Input() index: number;
  @Input() startTime: string;
  hourly: Hourly[] = [];
  hourlySubscription: Subscription;
  isFetching = false;
  isError = false;
  error = '';
  avail=false;
  editMulti: boolean[] = [];
  runTimes: string[] = [];
  runMinutes: number[] = [];
  cycleTime: number;
  alwaysUp: number[] = [];


  constructor(
    private hourServ: HourlyService,
    private dayServ: DaysService,
    private auth: AuthService,
    private opServ: OpService
  ) { }



  ngOnInit() {
    this.getHourly();
    this.hourlySubscription = this.hourServ.hourlyChanged.subscribe(
      ()=>{
        this.getHourly();
    })
  }

  getHourly(){
    if (this.machine.currentOp != "None"){
      if (this.machine.currentOp.includes("/")){
        this.machine.currentOp = this.opServ.slashToDash(this.machine.currentOp);
      }
      this.opServ.fetchOp(this.machine.currentOp + "&job=" + this.machine.currentJob).subscribe(
        (op)=>{
          this.cycleTime = +op.cycleTime;
          //Sets numeric cycle time
          let date = this.dayServ.year +"-"+this.dayServ.stringMonth+"-"+this.dayServ.today;
          //Sets format of date for hourly retrieval
          this.hourServ.fetchHourly("date="+date+"&"+"machine="+this.auth.splitJoin(this.machine.machine)).subscribe(
            hourly => {
              if (hourly.length > 0){
                this.hourServ.canSetTime[this.index] = true;
                if (hourly[0].startTime){
                  this.hourServ.startTimes[this.index] = hourly[0].startTime;
                };
              };
              this.hourly = hourly;
              this.avail=true;
              this.hourly.forEach((lot) =>{
                if (lot.startTime){
                  let runHours = +(lot.time[0]+lot.time[1]) - +(lot.startTime[0]+lot.startTime[1]);
                  let runMin = +(lot.time[3]+lot.time[4]) - +(lot.startTime[3]+lot.startTime[4]);
                  let runMinString: string;
                  if (runMin < 0 && runHours > 0){
                    runMin += 60;
                    runHours -= 1;
                  } else if (runMin < 0){
                    runMin = 0;
                  };
                  this.alwaysUp.push(+(((runMin + (runHours * 60))*60)/this.cycleTime).toFixed(0));
                  if (runMin == 0){
                    runMinString = "00";
                  } else if (runMin < 10){
                    runMinString = "0" + runMin
                  } else {
                    runMinString = "" + runMin;
                  };
                  this.runTimes.push(runHours + ":" + runMinString);
                  this.runMinutes.push((runHours*60)+runMin);
                }
                this.editMulti.push(false);
                if (+(lot.time[0]+lot.time[1])==12) {
                  lot.time = lot.time + " PM";
                } else if (+(lot.time[0]+lot.time[1])>11){
                  let timeHold = +(lot.time[0]+lot.time[1]) - 12;
                  lot.time = timeHold + lot.time.slice(2, 5) + " PM";
                } else if (+(lot.time[0]+lot.time[1]) == 0) {
                  let timeHold = +(lot.time[0]+lot.time[1]) + 12;
                  lot.time = timeHold + lot.time.slice(2, 5) + " AM";
                } else {
                  let timeHold = +(lot.time[0]+lot.time[1]);
                  lot.time = timeHold + lot.time.slice(2, 5) + " AM";
                };
              })
              this.isFetching = false;
            }, error => {
              this.isFetching = false;
              this.isError = true;
              this.error = error.message
            }
          )
        }
      );
      this.hourly = [];
      if (+this.dayServ.today < 10 && this.dayServ.today.length <2){
        this.dayServ.today = "0"+this.dayServ.today
      };
      if (+this.dayServ.month < 10 && this.dayServ.stringMonth.length <2){
        this.dayServ.stringMonth = "0"+this.dayServ.month
      };
    }
  }



  ngOnDestroy(){
    this.hourlySubscription.unsubscribe();
  }

  onEdit(set){
    this.editMulti[set] = true;
  }

  onDelete(id){
    if (confirm("Are you sure you want to delete this hourly production?")){
      this.hourServ.deleteHourly(id).subscribe()
      setTimeout(()=>{
        this.hourServ.hourlyChanged.next();
      }, 100)
    }
  }

}
