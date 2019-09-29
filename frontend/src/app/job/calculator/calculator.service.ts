import { Injectable } from '@angular/core';
import { Bar } from './bar.model';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { JobService } from 'src/app/job/job.service';
import { ProductionService } from '../../production/production.service';
import { OpService } from '../job-ops/operation.service';

@Injectable({providedIn: 'root'})
export class CalculatorService {
    submitted = false;
    facing: number;
    cycleTime: number;
    latheForm: FormGroup;
    bars: Bar[];
    totalParts: number;
    partsToMake: number;
    total = 0;

    fullBars: Bar[] =[]
    regBars = 0;
    feet: number;
    runHours: number;

    densities = [
        {
            material: "Stainless Steel", 
            density: .289
        },
        {
            material: "Steel", 
            density: .28
        },
        {
            material: "Carbon Steel", 
            density: .285
        },
        {
            material: "Aluminum", 
            density: .098
        },
        {
            material: "Monel", 
            density: .318
        },
        {
            material: "Delrin", 
            density: .0513
        },
        {
            material: "A286", 
            density: .286
        }
    ];


    constructor(
        private jobServ: JobService,
        private pro: ProductionService,
        private opServ: OpService
    ){}


    resetValues(){
        this.submitted = false;
        this.facing = null;
        this.latheForm = null;
        this.bars = null;
        this.partsToMake = null;
        this.fullBars = null;
        this.regBars = 0;
        this.total = 0;
        this.runHours = null;
        this.feet = null;
        this.cycleTime = null;
    }

    getControls(){
        return (<FormArray>this.latheForm.get('bars')).controls;
    }

    newBars() {
        (<FormArray>this.latheForm.get('bars')).push(
            new FormGroup({
            'noBars': new FormControl(1, Validators.required),
            'barLength': new FormControl(null, Validators.required)
            })
        )
    }

    onRemoveBar(index: number){
        (<FormArray>this.latheForm.get('bars')).removeAt(index);
    }
    

    onSubmitRemaining(){
        this.jobServ.jobHold.cutOff = this.latheForm.value.cutOff;
        this.jobServ.jobHold.oal = this.latheForm.value.oal;
        this.facing = this.latheForm.value.mainFacing + this.latheForm.value.subFacing;
        this.bars = this.latheForm.value.bars;
        this.jobServ.jobHold.remainingQuantity = ""+this.calculateQuantity();
        this.partsToMake = +this.jobServ.jobHold.remainingQuantity;
        this.jobServ.changeJob(this.jobServ.jobHold, this.jobServ.jobHold.jobNumber).subscribe();
        this.submitted = true;
    }


    onSubmitTotal(){
        this.jobServ.jobHold.cutOff = this.latheForm.value.cutOff;
        this.jobServ.jobHold.oal = this.latheForm.value.oal;
        this.jobServ.jobHold.subFacing = this.latheForm.value.subFacing;
        this.jobServ.jobHold.mainFacing = this.latheForm.value.mainFacing
        this.facing = +this.jobServ.jobHold.mainFacing + +this.jobServ.jobHold.subFacing;
        this.fullBars = this.latheForm.value.bars;
        this.findRunable();
        this.partsToMake = this.calculateQuantity()
        this.jobServ.jobHold.possibleQuantity = ""+this.calculateQuantity();
        this.pro.fetchProduction("job="+this.jobServ.jobHold.jobNumber).subscribe(production => {
            production.forEach(pro => {
                this.total = +pro.quantity + this.total
            })
            let value = this.partsToMake - this.total;
            this.jobServ.jobHold.remainingQuantity = "" + value; 
            this.jobServ.changeJob(this.jobServ.jobHold, this.jobServ.jobHold.jobNumber).subscribe(
                ()=>{
                    this.opServ.fetchOpByJob(this.jobServ.jobHold.jobNumber).subscribe((ops)=>{
                        ops.forEach((op)=>{
                            if(op.opNumber.includes("/")){
                                op.opNumber = this.opServ.slashToDash(op.opNumber);
                            }
                            let update = {remainingQuantity: this.jobServ.jobHold.remainingQuantity};
                            let search = op.opNumber + "&job=" + op.jobNumber;
                            this.opServ.changeOpRemaining(update, search).subscribe();
                        });
                    });
                }
            );
        })
        this.submitted = true;

    }


    onSubmitByWeight(){
        this.jobServ.jobHold.cutOff = this.latheForm.value.cutOff;
        this.jobServ.jobHold.oal = this.latheForm.value.oal;
        this.jobServ.jobHold.subFacing = this.latheForm.value.subFacing;
        this.jobServ.jobHold.mainFacing = this.latheForm.value.mainFacing
        this.facing = +this.jobServ.jobHold.mainFacing + +this.jobServ.jobHold.subFacing;
        if (this.latheForm.value.type == "Hex"){
            this.findLengthFromHexWeight();
        } else {
            this.findLengthFromRoundWeight();
        }
        this.jobServ.jobHold.weightQuantity = ""+this.partsToMake;
        this.jobServ.jobHold.weightRecieved = ""+this.latheForm.value.weight
        this.jobServ.jobHold.weightLength = ""+this.feet;
        if (!this.jobServ.jobHold.remainingQuantity){
            this.pro.fetchProduction("job="+this.jobServ.jobHold.jobNumber).subscribe(production => {
                production.forEach(pro => {
                    this.total = +pro.quantity + this.total
                })
                let value = this.partsToMake - this.total;
                this.jobServ.jobHold.remainingQuantity = "" + value; 
                this.jobServ.changeJob(this.jobServ.jobHold, this.jobServ.jobHold.jobNumber).subscribe(()=>{},(error)=>{console.log(error)});
            })
        } else {
            this.jobServ.changeJob(this.jobServ.jobHold, this.jobServ.jobHold.jobNumber).subscribe(
                ()=>{
                    this.opServ.fetchOpByJob(this.jobServ.jobHold.jobNumber).subscribe((ops)=>{
                        ops.forEach((op)=>{
                            if(op.opNumber.includes("/")){
                                op.opNumber = this.opServ.slashToDash(op.opNumber);
                            }
                            let update = {remainingQuantity: this.jobServ.jobHold.remainingQuantity};
                            let search = op.opNumber + "&job=" + op.jobNumber;
                            this.opServ.changeOpRemaining(update, search).subscribe();           
                        });
                    });
                },
                (error)=>{console.log(error);}
            );
        }
        this.submitted = true;
        if (this.latheForm.value.cycleTime){
            this.cycleTime = this.latheForm.value.cycleTime;
            this.runHours = +this.findRunTime().toFixed(2)
        }
    }


    onSubmitLengthByWeight(){
        if (this.latheForm.value.type == "Hex"){
            this.findLengthFromHexWeight();
        } else {
            this.findLengthFromRoundWeight();
        }
        this.submitted = true;
    }

    
    findRunTime(){
        let totalSecs = (this.latheForm.value.cycleMin*60) + this.latheForm.value.cycleSec;
        let secsLeft = totalSecs * this.partsToMake;
        let hoursLeft = secsLeft/3600;
            return hoursLeft
    }
    
    findLengthFromRoundWeight(){
        let rad = this.latheForm.value.dia/2;
        let radSq = rad * rad;
        let area = Math.PI * radSq;
        let inWeight = this.densities.filter( mat =>{
            return mat.material === this.latheForm.value.material
        })[0].density * area;
        let ftWeight = inWeight * 12;
        this.feet = +(this.latheForm.value.weight/ftWeight).toFixed(2);
        if (this.latheForm.value.oal){
            this.fullBarsFromTotalLength()
            this.partsToMake = this.calculateQuantity()
        }
    }

    findLengthFromHexWeight(){
        let edge = this.latheForm.value.dia/(Math.sqrt(3))
        let area = edge*edge*3*Math.sqrt(3)/2
        let inWeight = this.densities.filter( mat =>{
            return mat.material === this.latheForm.value.material
        })[0].density * area;
        let ftWeight = inWeight * 12;
        this.feet = +(this.latheForm.value.weight/ftWeight).toFixed(2);
        if (this.latheForm.value.oal){
            this.fullBarsFromTotalLength()
            this.partsToMake = this.calculateQuantity()
        }
    }

    fullBarsFromTotalLength(){
        this.fullBars = [];
        let barHold: Bar={
            "barLength": 0,
            "noBars": 0
        };
        let barSizedHold: Bar ={
            "barLength": 0,
            "noBars": 0
        };
        barSizedHold.barLength = this.latheForm.value.averageBar
        barSizedHold.noBars = Math.floor(this.feet*12/this.latheForm.value.averageBar)
        this.fullBars.push(barSizedHold);
        barHold.barLength = this.feet%this.latheForm.value.averageBar;
        barHold.noBars = 1
        this.fullBars.push(barHold);
        this.feet = +this.feet.toFixed(2)
        this.findRunable();
    }
 
    findRunable(){
        this.regBars = 0;
        this.bars = [];
        let barRegHold: Bar={
            "barLength": 0,
            "noBars": 0
        };
        for (let bar in this.fullBars){
            let barHold: Bar={
                "barLength": 0,
                "noBars": 0
            };
            barHold.noBars = this.fullBars[bar].noBars;
            this.regBars = this.regBars + (Math.floor(+this.fullBars[bar].barLength/this.latheForm.value.cutTo)*this.fullBars[bar].noBars);
            barHold.barLength = this.fullBars[bar].barLength%this.latheForm.value.cutTo;
            if (barHold.barLength != 0){
                this.bars.push(barHold);
            }
        }
        barRegHold.noBars = this.regBars;
        barRegHold.barLength = this.latheForm.value.cutTo;
        this.bars.push(barRegHold);
        this.partsToMake = this.calculateQuantity()
    }

    calculateQuantity(){
        this.jobServ.jobHold.bars = ""
        let totalJobLength: number = +this.jobServ.jobHold.oal + +this.jobServ.jobHold.cutOff + this.facing;
        let totalPieces = 0;
        for (let i in this.bars){
            this.jobServ.jobHold.bars = this.jobServ.jobHold.bars + this.bars[i].noBars + " " + this.bars[i].barLength + " "
          let length: Number;
          if (this.bars[i].barLength > this.latheForm.value.barEnd){ 
              length = this.bars[i].barLength - this.latheForm.value.barEnd;
          } else {
              length = 0
          }
          let pieces = Math.floor(+length/totalJobLength);
          let tempTotal = pieces * this.bars[i].noBars;
          totalPieces = totalPieces + tempTotal;
        }
        return totalPieces;
    }

}