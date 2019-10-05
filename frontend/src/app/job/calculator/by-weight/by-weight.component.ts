import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobService } from 'src/app/job/job.service';
import { CalculatorService } from '../calculator.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-by-weight',
  templateUrl: './by-weight.component.html',
  styleUrls: ['./by-weight.component.css']
})
export class ByWeightComponent implements OnInit, OnDestroy {
  type =["Round ⌀", "Hex"];
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
    setTimeout(()=>{
      this.jobServ.fetchJob(this.jobNum)
      .subscribe(job => {
        this.jobServ.jobHold = job;
        this.initForm();
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
    let weight: number;
    if (this.jobServ.jobHold){
      if (this.jobServ.jobHold.weightRecieved){
      weight = +this.jobServ.jobHold.weightRecieved
      }
    }
    let dia: number;
    let averageBar = 144;


    this.calc.latheForm = new FormGroup({
      "type": new FormControl(this.type[0], Validators.required),
      "averageBar": new FormControl(averageBar, Validators.required),
      "cutTo": new FormControl(this.auth.defaultBarCut, Validators.required),
      "material" : new FormControl(this.calc.densities[0].material, Validators.required),
      "dia": new FormControl(dia, Validators.required),
      "weight": new FormControl(weight, Validators.required),
      'cutOff': new FormControl(cutOff, Validators.required),
      'oal': new FormControl(oal, Validators.required),
      'mainFacing': new FormControl(mainFacing, Validators.required),
      'subFacing': new FormControl(subFacing),
      'barEnd': new FormControl(this.auth.defaultBarEnd, Validators.required),
    });
  }

  ngOnDestroy(){
    this.calc.resetValues()
  }


}