import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PartService } from '../part.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Part } from '../part.model';

@Component({
  selector: 'app-part-new',
  templateUrl: './part-new.component.html',
  styleUrls: ['./part-new.component.css']
})
export class PartNewComponent implements OnInit {
  error = '';
  canInput= false;
  partForm: FormGroup;
  isError = false;
  andCalculate = "None";
  
  constructor(
    private partServ: PartService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    this.initForm();
    this.auth.hideButton(0);
  }
    
  private initForm() {
    let part: string;

    this.partForm = new FormGroup({
      'partNumber': new FormControl(part, Validators.required)
    });
  }

  
  onSubmit(){
    this.andCalculate = "None";
    this.newPart(this.partForm.value);
  }

  newPart(data: Part) {
    this.error= null;
    this.isError = false;
    this.partServ.partChanged.next();
    this.partServ.addPart(data).subscribe(() => {},
      (error) =>{
        this.isError = true;
        this.error = error;
    });
    setTimeout(()=>{
      if (this.isError){
        this.error = "That part already exists!";
      } else {
        this.router.navigate([".."], {relativeTo: this.route})
      }
    }, 50);
  }

  onAddThenCalcByLength(){
    this.partServ.holdPart(this.partForm.value)
    this.andCalculate = "length";
    this.newPart(this.partForm.value);
  }

  onAddThenCalcByWeight(){
    this.partServ.holdPart(this.partForm.value);
    this.andCalculate = "weight";
    this.newPart(this.partForm.value);
  }

  onCancel(){
    window.history.back();
  }

  ngOnDestroy(){
    this.auth.showButton(0);
  }

}
