import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-production-find',
  templateUrl: './production-find.component.html',
  styleUrls: ['./production-find.component.css']
})
export class ProductionFindComponent implements OnInit {
  @ViewChild('data', {static:false}) jobForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  onSubmit(){
    let job = this.jobForm.value.jobNumber
    let machine =""
    if (this.jobForm.value.machine){
      machine = this.jobForm.value.machine
      machine = "&machine="+this.auth.splitJoin(machine)
    }
    let movement = "../"+job+machine;
    this.router.navigate([movement], {relativeTo: this.route})
  }

  onCancel(){
    window.history.back();
  }

  ngOnInit(){
    this.auth.hideButton(1);
  }

  ngOnDestroy(){
    this.auth.showButton(1);
  }
}
