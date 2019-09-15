import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Machine } from 'src/app/machine/machine.model';
import { JobService } from '../job.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Job } from '../job.model';

@Component({
  selector: 'app-job-new',
  templateUrl: './job-new.component.html',
  styleUrls: ['./job-new.component.css']
})
export class JobNewComponent implements OnInit {
  error = '';
  canInput= false;
  jobForm: FormGroup;
  isError = false;
  machines: Machine[] = []
  andCalculate = "none";
  
  constructor(
    private jobServ: JobService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    this.auth.hideButton(0);
    this.initForm();
  }
    
  private initForm() {
    let job: string;
    let part: string;
    let cycleTime: string;
    let orderQuantity: string;
    let weightRecieved: string;
    let oal: string;
    let cutOff: string;
    let mainFacing: string;
    let subFacing: string;

    this.jobForm = new FormGroup({
      'job': new FormControl(job, Validators.required),
      'part': new FormControl(part, Validators.required),
      'cycleTime': new FormControl(cycleTime),
      "orderQuantity": new FormControl(orderQuantity),
      "weightRecieved": new FormControl(weightRecieved),
      "oal": new FormControl(oal),
      "cutOff": new FormControl(cutOff),
      "mainFacing": new FormControl(mainFacing),
      "subFacing": new FormControl(subFacing)
    });
  }

  
  onSubmit(){
    this.andCalculate = "none";
    this.newJob(this.jobForm.value);
  }

  newJob(data: Job) {
    this.error= null;
    this.isError = false;
    this.jobServ.jobChanged.next();
    this.jobServ.addJob(data).subscribe(() => {},
      (error) =>{
        this.isError = true;
        this.error = error;
    });
    setTimeout(()=>{
      if (this.isError){
        this.error = "That job already exsists on that machine!";
      } else if (this.andCalculate == "length"){
        this.router.navigate(["calculator/job"], {relativeTo: this.route})
      } else if (this.andCalculate == "weight"){
        this.router.navigate(["calculator/weight"], {relativeTo: this.route})
      } else {
        this.router.navigate([".."], {relativeTo: this.route})
      }
    }, 50);
  }

  onAddThenCalcByLength(){
    this.jobServ.jobHold = this.jobForm.value;
    this.andCalculate = "length";
    this.newJob(this.jobForm.value);
  }

  onAddThenCalcByWeight(){
    this.jobServ.jobHold = this.jobForm.value;
    this.andCalculate = "weight";
    this.newJob(this.jobForm.value);
  }

  onCancel(){
    window.history.back();
  }

  ngOnDestroy(){
    this.auth.showButton(0);
  }

}
