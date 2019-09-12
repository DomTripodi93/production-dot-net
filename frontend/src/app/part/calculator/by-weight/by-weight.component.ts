import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PartService } from 'src/app/part/part.service';
import { CalculatorService } from '../calculator.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-by-weight',
  templateUrl: './by-weight.component.html',
  styleUrls: ['./by-weight.component.css']
})
export class ByWeightComponent implements OnInit, OnDestroy {
  type =["Round ⌀", "Hex"];
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
    setTimeout(()=>{
      this.partServ.fetchPartById(this.id)
      .subscribe(part => {
        this.partServ.partHold = part;
        this.initForm();
      });
    },20);
  }
  
  private initForm() {
    let cutOff: number;
    if (this.partServ.partHold){
      if (this.partServ.partHold.cutOff){
       cutOff = +this.partServ.partHold.cutOff 
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
      if (this.partServ.partHold.mainFacing){
       mainFacing = +this.partServ.partHold.mainFacing 
      }
    }
    let subFacing: number;
    if (this.partServ.partHold){
      if (this.partServ.partHold.subFacing){
       subFacing = +this.partServ.partHold.subFacing
      }
    }
    let barEnd = 3;
    let weight: number;
    if (this.partServ.partHold){
      if (this.partServ.partHold.weightRecieved){
      weight = +this.partServ.partHold.weightRecieved
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