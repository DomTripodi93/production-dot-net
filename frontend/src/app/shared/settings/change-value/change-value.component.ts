import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-change-value',
  templateUrl: './change-value.component.html',
  styleUrls: ['./change-value.component.css']
})
export class ChangeValueComponent implements OnInit {
  @Input() size: number;
  @Input() time: string;
  @Input() type: string;
  editValueForm: FormGroup;
  startTimeForm = false;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    if (this.type == "time"){
      this.startTimeForm = true;
    }
    this.editValueForm = new FormGroup({
      'time': new FormControl(this.time),
      'size': new FormControl(this.size)
    });
  }

  onSubmit(){
    if (this.type == "time"){
      let values = {
        defaultStartTime: this.editValueForm.value.time
      };
      this.auth.changeSetting(this.type, values).subscribe(()=>{
        this.auth.checkSettings().subscribe();
      });
      this.auth.setStartTime = false;
    } else if (this.type == "cut"){
      let values = {
        defaultBarCut: this.editValueForm.value.size
      };
      this.auth.changeSetting(this.type, values).subscribe(()=>{
        this.auth.checkSettings().subscribe();
      });
      this.auth.setBarCut = false;
    } else if (this.type == "end"){
      let values = {
        defaultBarEnd: this.editValueForm.value.size
      };
      this.auth.changeSetting(this.type, values).subscribe(()=>{
        this.auth.checkSettings().subscribe();
      });
      this.auth.setBarEnd = false;
    };
  }

  onCancel(){
    if (this.type == "time"){
      this.auth.setStartTime = false;
    }
    if (this.type == "cut"){
      this.auth.setBarCut = false;
    }
    if (this.type == "end"){
      this.auth.setBarEnd = false;
    }
  }
}
