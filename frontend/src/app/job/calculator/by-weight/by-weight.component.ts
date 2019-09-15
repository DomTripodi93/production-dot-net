import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobService } from 'src/app/job/job.service';
import { CalculatorService } from '../calculator.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

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
    private router: Router
  ){}

  ngOnInit(){
    this.route.params.subscribe((params: Params) =>{
      this.jobNum = params['jobNum'];
    });
    this.initForm();
    setTimeout(()=>{
      this.jobServ.fetchJob(this.jobNum)
      .subscribe(job => {
        this.jobServ.jobHold = job[0];
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
    let barEnd = 3;
    let weight: number;
    if (this.jobServ.jobHold){
      if (this.jobServ.jobHold.weightRecieved){
      weight = +this.jobServ.jobHold.weightRecieved
      }
    }
    let dia: number;
    let averageBar = 144;
    let cutTo = 48;


    this.calc.latheForm = new FormGroup({
      "type": new FormControl(this.type[0]),
      "averageBar": new FormControl(averageBar),
      "cutTo": new FormControl(cutTo),
      "material" : new FormControl(this.calc.densities[0].material),
      "dia": new FormControl(dia),
      "weight": new FormControl(weight),
      'cutOff': new FormControl(cutOff, Validators.required),
      'oal': new FormControl(oal, Validators.required),
      'mainFacing': new FormControl(mainFacing, Validators.required),
      'subFacing': new FormControl(subFacing),
      'barEnd': new FormControl(barEnd, Validators.required),
    });
  }

  ngOnDestroy(){
    this.calc.resetValues()
  }


}