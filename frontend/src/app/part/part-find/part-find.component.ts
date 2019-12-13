import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from 'src/app/part/part.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-part-find',
  templateUrl: './part-find.component.html',
  styleUrls: ['./part-find.component.css']
})
export class PartFindComponent implements OnInit, OnDestroy{
  @ViewChild('data', {static:false}) jobForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  onSubmit(){
    let search = "";
    if (this.jobForm.value.job){
      search = "job=" + this.jobForm.value.job;
    } else if (this.jobForm.value.part){
      search = "" + this.jobForm.value.part;
    }
    let movement = "../" + search;
    this.router.navigate([movement], {relativeTo: this.route});
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