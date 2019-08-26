import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Bar } from "../bar.model"
import { CalculatorService } from '../calculator.service';
import { PartService } from 'src/app/part/part.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-remaining',
  templateUrl: './remaining.component.html',
  styleUrls: ['./remaining.component.css']
})
export class RemainingComponent implements OnInit, OnDestroy {
  id: number;

  constructor(
    private calc: CalculatorService,
    private partServ: PartService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(){
    this.route.params.subscribe((params: Params) =>{
      this.id = +params['id'];
    });
    this.initForm();
    setTimeout(()=>{
      this.partServ.fetchPartById(this.id)
      .subscribe(part => {
        this.partServ.partHold = part;
        this.initForm();
        if (this.partServ.partHold){
          if (this.partServ.partHold.bars){
            let i = 0
            let barValues = this.partServ.partHold.bars.split(" ")
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
    if (this.partServ.partHold){
      if (this.partServ.partHold.cut_off){
       cutOff = +this.partServ.partHold.cut_off 
      }
    }
    let oal: number;
    if (this.partServ.partHold){
      if (this.partServ.partHold.oal){
       oal = +this.partServ.partHold.oal 
      }
    }
    let mainFacing: number;
    if (this.partServ.partHold){
      if (this.partServ.partHold.main_facing){
       mainFacing = +this.partServ.partHold.main_facing 
      }
    }
    let subFacing: number;
    if (this.partServ.partHold){
      if (this.partServ.partHold.sub_facing){
       subFacing = +this.partServ.partHold.sub_facing
      }
    }
    let barEnd = 3;
    let bars = new FormArray([]);

    this.calc.latheForm = new FormGroup({
      'job': new FormControl(this.partServ.partHold.job),
      'cutOff': new FormControl(cutOff, Validators.required),
      'oal': new FormControl(oal, Validators.required),
      'mainFacing': new FormControl(mainFacing, Validators.required),
      'subFacing': new FormControl(subFacing, null),
      'barEnd': new FormControl(barEnd, Validators.required),
      'bars': bars
    });
  }

  ngOnDestroy(){
    this.calc.resetValues();
    this.partServ.partHold = null;
  }

}
