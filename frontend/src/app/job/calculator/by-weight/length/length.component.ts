import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CalculatorService } from '../../calculator.service';

@Component({
  selector: 'app-length',
  templateUrl: './length.component.html',
  styleUrls: ['./length.component.css']
})
export class LengthComponent implements OnInit, OnDestroy{ 
  type =["Round ⌀", "Hex"];

  constructor(
    public calc: CalculatorService,
  ){}

  ngOnInit(){
    this.initForm()
  }

  private initForm() {
    let weight: number;
    let dia: number;


    this.calc.latheForm = new FormGroup({
      "type": new FormControl(this.type[0]),
      "material" : new FormControl(this.calc.densities[0].material),
      "dia": new FormControl(dia),
      "weight": new FormControl(weight),
    });
  }

  ngOnDestroy(){
    this.calc.resetValues()
  }
}
