import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MachineService } from '../../machine/machine.service';
import { Machine } from 'src/app/machine/machine.model';
import { HourlyService } from '../hourly.service';
import { DaysService } from 'src/app/shared/days/days.service';
import { Hourly } from '../hourly.model';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { JobService } from 'src/app/job/job.service';
import { JobInfo } from 'src/app/machine/jobInfo.interface';

@Component({
  selector: 'app-hourly-new',
  templateUrl: './hourly-new.component.html',
  styleUrls: ['./hourly-new.component.css']
})
export class HourlyNewComponent implements OnInit {
  canInput= false;
  hourlyForm: FormGroup;
  machines: Machine[] = []
  jobs = ["None"];
  ops = ["None"];

  constructor(
    private hourServ: HourlyService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dayServe: DaysService,
    private mach: MachineService,
    private opServ: OpService,
    private jobServ: JobService
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.machines = machines;
      this.jobServ.fetchAllJobs().subscribe(paginatedResponse =>{
        let goneThrough = 1;
        let response = paginatedResponse.result;
        if (response.length==0){
          this.initForm();
        } else {
          response.forEach(job => {
            this.jobs.push(job.jobNumber);
            goneThrough++;
            if (goneThrough == response.length+1){
              this.changeOps("None");
              this.initForm();
            }
          });
        }
      });
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
    let counterQuantity: number;
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
    let jobNumber ='';
    let opNumber ='';

    this.hourlyForm = new FormGroup({
      'quantity': new FormControl(quantity, Validators.required),
      'counterQuantity': new FormControl(counterQuantity),
      'date': new FormControl(date, Validators.required),
      'time': new FormControl(time, Validators.required),
      'machine': new FormControl(machine, Validators.required),
      'jobNumber': new FormControl(jobNumber, Validators.required),
      'opNumber': new FormControl(opNumber, Validators.required)
    });
  }
  
  onSubmit(){
    this.newHourly(this.hourlyForm.value);
  }

  newHourly(data: Hourly) {
    this.hourServ.addHourly(data).subscribe();
    setTimeout(()=>{
      this.router.navigate([".."], {relativeTo: this.route});
    },10);
  }

  changeOps(option: String){
    this.ops = ["None"]
    if (option != "None"){
      this.opServ.fetchOpByJob(option).subscribe((ops)=>{
        ops.forEach((op)=>{
          this.ops.push(op.opNumber);
        })
      })
    }
  }

  onCancel(){
    window.history.back();
  }

  ngOnDestroy(){
    this.auth.showButton(0);
  }


}