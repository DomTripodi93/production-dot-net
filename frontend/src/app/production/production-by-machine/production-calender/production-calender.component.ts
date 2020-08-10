import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { DaysService } from 'src/app/shared/days/days.service';
import { Production } from '../../production.model';
import { ProductionService } from '../../production.service';
import { Machine } from 'src/app/machine/machine.model';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { MachineService } from 'src/app/machine/machine.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-production-calender',
  templateUrl: './production-calender.component.html',
  styleUrls: ['./production-calender.component.css']
})
export class ProductionCalenderComponent implements OnInit, OnDestroy {
  @Input() machine: Machine;
  @Input() month: number;
  @ViewChild('newMonth') newMonthForm: NgForm;
  subscriptions: Subscription[] = [];
  editJob = false;
  production: Production[];
  date = new Date();
  today = this.date.getDate();
  monthHold: string;
  lastMonthHold: string;
  year = this.date.getFullYear();
  day = this.date.getDay();
  defaultMonth = ""; 
  oldMonth: number = this.month;
  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
  numberOfDays: number;
  monthDays = []
  lastMonthDays = []
  firstDayOfMonth = [];
  dayAvg: number;
  nightAvg: number;
  overNightAvg: number;
  machTotal: number
  total: number
  editMode = false;
  firstProDay: number;
  firstProMonth: number;
  displayMax: number;
  editCount = 0;
  remaining = 0;

  constructor(
    public auth: AuthService,
    private router: Router,
    public dayServ: DaysService,
    public proServ: ProductionService,
    private opServ: OpService,
    private machServ: MachineService
  ) { }

  ngOnInit() {
    this.editMode = false;
    this.setMonths();
    this.getProduction();
    this.getTotal();
    this.machServ.getJobs();
    this.subscriptions.push(this.proServ.proChanged.subscribe(()=>{
      this.getProduction();
      this.getTotal();
    }));
    this.subscriptions.push(this.proServ.proChangedAvg.subscribe(()=>{
      this.editMode = false;
      this.getProduction();
    }));
    this.subscriptions.push(this.machServ.machCancel.subscribe(()=>{
      this.editJob = false;
    }));
    this.subscriptions.push(this.proServ.checkEdits.subscribe(()=>{
      this.editsOpen();
    }));
  }

  editsOpen(){
    if (this.proServ.editMach == this.machine.machine){
      if (this.proServ.openEdit){
        if(this.editCount == 0){
          this.setRemaining();
        }
        this.editCount += 1;
      } else {
        this.editCount -= 1;
        if (this.editCount == 0){
          this.getProduction();
          this.getTotal();
          this.updateRemaining();
          this.editMode = false;
        }
      }
    }
  }

  setRemaining(){
    let opSearch = this.opServ.slashToDash(this.machine.currentOp) + "&job=" + this.machine.currentJob;
    this.opServ.fetchOp(opSearch).subscribe((op)=>{
      this.remaining = +op.remainingQuantity;
    })    
  }

  updateRemaining(){
    let opSearch = this.opServ.slashToDash(this.machine.currentOp) + "&job=" + this.machine.currentJob;
    let remainingQuantity = "" + (this.remaining + this.proServ.deleted);
    let setValue = {remainingQuantity: remainingQuantity};
    this.opServ.changeOpRemaining(setValue, opSearch).subscribe(()=>{
      this.proServ.changeJobInfo(this.machine.currentJob);
      this.proServ.deleted = 0;
    });
  }

  setMonths(){
    let monthNum = this.month + 1;
    this.monthHold = "" + monthNum;
    if (this.month > 0){
      let lastMonthNum = this.month;
      this.lastMonthHold = "" + lastMonthNum;
    } else {
      this.lastMonthHold = "12";
    }
    if (this.month < 9){
      this.monthHold ="0"+this.monthHold;
    }
    if (this.month < 8 && this.month != 0){
      this.lastMonthHold ="0"+this.lastMonthHold;
    }
    this.defaultMonth = this.year + "-" + this.monthHold;
  }

  getProduction(){
    let search = "mach=" + this.auth.splitJoin(this.machine.machine) 
      + "&job=" + this.machine.currentJob 
      + "&op=" + this.opServ.slashToDash(this.machine.currentOp);
    this.proServ.fetchProduction(search).subscribe(prod=>{
      this.production = prod;
      if (prod.length > 0){
        this.firstProDay = +(prod[0].date.substring(8,10));
        this.firstProMonth = +(prod[0].date.substring(5,7));
      } else {
        this.firstProDay = this.today;
        this.firstProMonth = +this.month + 1;
      }
      this.setDate();
      this.setAverage();
    })
  }

  getTotal(){
    this.total = 0;
    let search = "op=" + this.opServ.slashToDash(this.machine.currentOp)
      + "&job=" + this.machine.currentJob;
    this.proServ.fetchProduction(search).subscribe(prod=>{
      this.total = 0;
      prod.forEach((set)=>{
        this.total += +set.quantity;
      })
    })
  }

  editProd(){
    this.editMode = true;
  }

  submitAll(){
    this.proServ.proSubmit.next();
  }

  cancel(){
    this.editMode = false;
  }

  setDate(){
    this.daysInMonth(this.year, this.month+1);
    let firstDay = new Date(this.year, this.month, 1);
    this.firstDayOfMonth = [...Array(firstDay.getDay()).keys()];
    this.displayMax = this.today+this.firstDayOfMonth.length
    if (this.displayMax%7 != 0){
      let totalDays = ((Math.floor(this.displayMax/7) + 1)*7) - this.firstDayOfMonth.length
      if (totalDays < this.numberOfDays){
        this.monthDays = [...Array(totalDays).keys()].map(day => day + 1);
      } else {
        this.monthDays = [...Array(this.numberOfDays).keys()].map(day => day + 1);
      }
    } else {
      this.monthDays = [...Array(this.today).keys()].map(day => day + 1);
    }
    if (this.firstProMonth == this.month + 1){
      this.lastMonthDays = [];
      if (this.firstDayOfMonth.length + this.firstProDay > 7){
        this.monthDays = this.monthDays.splice(7-this.firstDayOfMonth.length ,this.monthDays.length -1)
        this.removeUnusedWeeksBeginning(this.firstDayOfMonth.length, 14)
        this.firstDayOfMonth = [];
      }
    } else if (this.lastMonthDays.length > 0){
      this.firstDayOfMonth = [];
    } else {
      this.firstDayOfMonth = [];
      this.addOldWeeks();
    }
    // else if (this.firstDayOfMonth.length + this.firstProDay > 7){
    //   this.removeUnusedWeeksBeginning(this.firstDayOfMonth.length, 7);
    // }
  }

  removeUnusedWeeksBeginning(extra, start: number){
    if (this.firstDayOfMonth.length + this.firstProDay > start){
      this.monthDays = this.monthDays.splice(7 ,this.monthDays.length -1)
      this.removeUnusedWeeksBeginning(extra, start + 7)
    }
  }

  daysInMonth(year: number, month: number){
    this.numberOfDays = new Date(year, month, 0).getDate();
  }

  jobEdit(){
    this.editJob = true;
  }

  async addOldWeeks(){
    await this.addOldWeek();
    if (this.lastMonthDays[0] > this.firstProDay){
      this.addOldWeeks();
    }
  }

  addOldWeek(){
    if (this.firstDayOfMonth.length > 0){
      this.firstDayOfMonth = [];
    }
    if (this.lastMonthDays.length == 0){
      let first = this.monthDays[0];
      if (first - 7 > 0){
        let range = [...Array(7).keys()].map(day => day + first-7);
        this.monthDays = range.concat(this.monthDays);
      } else {
        let firstDay = new Date(this.year, this.month, 1).getDay();
        if (this.month == 0){
          this.daysInMonth(this.year-1, this.month+12);
        } else {
          this.daysInMonth(this.year, this.month);
        }
        if (firstDay > 0){
          this.lastMonthDays = [...Array(firstDay).keys()].map(day => day + this.numberOfDays - firstDay + 1)
        } else {
          this.lastMonthDays = [...Array(7).keys()].map(day => day + this.numberOfDays - 6);
        }
        let range = [...Array(first - 1).keys()].map(day => day + 1)
        console.log(range)
        this.monthDays = range.concat(this.monthDays);
      }
    } else {
      let first = this.lastMonthDays[0];
      if (first - 7 > 0){
        let range = [...Array(7).keys()].map(day => day + first-7);
        this.lastMonthDays = range.concat(this.lastMonthDays);
      }
    }
  }

  setAverage(){
    this.machTotal = 0;
    let dayShift = [];
    let nightShift = [];
    let overNight = [];
    let used = 0;
    this.production.forEach(pro=>{
      this.machTotal += +pro.quantity;
      used += 1;
      if (pro.average){
        if (pro.shift == "Day"){
          dayShift.push(pro.quantity)
        } else if (pro.shift == "Night"){
          nightShift.push(pro.quantity)
        } else if (pro.shift == "Over-Night"){
          overNight.push(pro.quantity)
        }
      }
      if (used == this.production.length){
        if (dayShift.length > 0){
          this.dayAvg = +(dayShift.reduce((a,b)=>{
            return +a + +b;
          }, 0) / dayShift.length).toFixed(0);
        } else {
          this.dayAvg = 0;
        }
        if (nightShift.length > 0){
          this.nightAvg = +(nightShift.reduce((a,b)=>{
            return +a + +b;
          }, 0) / nightShift.length).toFixed(0);
        } else {
          this.nightAvg = 0;
        }
        if (overNight.length > 0){
          this.overNightAvg = +(overNight.reduce((a,b)=>{
            return +a + +b;
          }, 0) / overNight.length).toFixed(0);
        } else {
          this.overNightAvg = 0;
        }
      }
    })
    if (this.production.length < 1){
      this.dayAvg = 0;
      this.nightAvg = 0;
      this.overNightAvg = 0;
    }
  }

  onViewDate(arr){
    let path = "/"+arr.join("/");
    this.router.navigate([path])
  }

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{sub.unsubscribe()})
  }
  //Removes observable subscriptions

}
