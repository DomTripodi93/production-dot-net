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
    let rev: string;

    this.partForm = new FormGroup({
      'partNumber': new FormControl(part, Validators.required),
      'rev': new FormControl(part, Validators.required),
      "machType": new FormControl(this.auth.machType)
    });
  }

  
  onSubmit(){
    this.andCalculate = "None";
    this.newPart(this.partForm.value);
  }

  newPart(data: Part) {
    this.error= null;
    this.isError = false;
    this.partServ.addPart(data).subscribe(() => {
      this.partServ.partChanged.next();
      this.router.navigate([".."], {relativeTo: this.route})
    },
      (error) =>{
        this.isError = true;
        this.error = "That part already exists!";
      }
    );
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
