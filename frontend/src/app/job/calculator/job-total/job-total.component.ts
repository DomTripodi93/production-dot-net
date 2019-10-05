import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Bar } from "../bar.model"
import { CalculatorService } from '../calculator.service';
import { JobService } from '../../../job/job.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-job-total',
  templateUrl: './job-total.component.html',
  styleUrls: ['./job-total.component.css']
})
export class JobTotalComponent implements OnInit, OnDestroy {
  jobNum: string;

  constructor(
    private calc: CalculatorService,
    private jobServ: JobService,
    private route: ActivatedRoute,
    private auth: AuthService
  ){}

  ngOnInit(){
    this.route.params.subscribe((params: Params) =>{
      this.jobNum = params['jobNum'];
    });
    this.initForm();
    setTimeout(()=>{
      this.jobServ.fetchJob(this.jobNum)
      .subscribe(job => {
        this.jobServ.jobHold = job;
        this.initForm();
        if (this.jobServ.jobHold){
          if (this.jobServ.jobHold.bars){
            let i = 0
            let barValues = this.jobServ.jobHold.bars.split(" ")
            for (let bar in barValues){
              if ((i+2)%2 == 0){
                (<FormArray>this.calc.latheForm.get('bars')).push(
                  new FormGroup({
                    'noBars': new FormControl(barValues[i], Validators.required),
                    'barLength': new FormControl(barValues[i+1], Validators.required)
                  })
                )};
              i++
              }
            }else{
              this.calc.newBars();
          }
        } 
      });
    },20);
  }
  
  private initForm() {
    let cutOff: number;
    if (this.jobServ.jobHold){
      if (this.jobServ.jobHold.cutOff){
       cutOff = +this.jobServ.jobHold.cutOff 
      }
    }
    let oal: number;
    if (this.jobServ.jobHold){
      if (this.jobServ.jobHold.oal){
       oal = +this.jobServ.jobHold.oal 
      }
    }
    let mainFacing: number;
    if (this.jobServ.jobHold){
      if (this.jobServ.jobHold.mainFacing){
       mainFacing = +this.jobServ.jobHold.mainFacing 
      }
    }
    let subFacing: number;
    if (this.jobServ.jobHold){
      if (this.jobServ.jobHold.subFacing){
       subFacing = +this.jobServ.jobHold.subFacing
      }
    }
    let bars = new FormArray([]);
    if (this.jobServ.jobHold){
      if (this.jobServ.jobHold.bars){
      cutOff = +this.jobServ.jobHold.cutOff 
      }
    }

    this.calc.latheForm = new FormGroup({
      'cutOff': new FormControl(cutOff, Validators.required),
      'oal': new FormControl(oal, Validators.required),
      'mainFacing': new FormControl(mainFacing, Validators.required),
      'subFacing': new FormControl(subFacing, null),
      'barEnd': new FormControl(this.auth.defaultBarEnd, Validators.required),
      "cutTo": new FormControl(this.auth.defaultBarCut),
      'bars': bars
    });
  }

  ngOnDestroy(){
    this.calc.resetValues()
  }


}