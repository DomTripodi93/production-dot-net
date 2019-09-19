import { Component, OnInit } from '@angular/core';
import { Part } from '../../part.model';
import { Subscription } from 'rxjs';
import { PartService } from '../../part.service';
import { AuthService } from 'src/app/shared/auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DaysService } from '../../../shared/days/days.service';

@Component({
  selector: 'app-part-find-show',
  templateUrl: './part-find-show.component.html',
  styleUrls: ['./part-find-show.component.css']
})
export class PartFindShowComponent implements OnInit {
  isFetching = false;
  isError = false;
  error = '';
  part: Part;
  partNum = "";
  id = '';
  subscription = new Subscription;
  subscription2 = new Subscription;

  constructor(
    private auth: AuthService,
    private partServ: PartService,
    private route: ActivatedRoute,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    this.subscription2 = this.route.params.subscribe((params: Params) =>{
      this.partNum = params['part'];
      this.getPart();
    });
    this.subscription = this.auth.authChanged.subscribe(
      ()=>{
        this.id = this.auth.user
      }
    )
  }

  onDelete(part, id){
    if (confirm("Are you sure you want to delete " +part+ "?")){
      this.partServ.deletePart(id).subscribe(()=>{
      setTimeout(()=>{this.getPart()},)}
      );
      this.partServ.partChanged.next();
    }
  }

  getPart() {
    this.isFetching = true;
    this.partServ.fetchPart(this.partNum)
      .subscribe(part => {
        console.log(this.part)
        this.part = part;
        console.log(this.part)
        this.dayServ.dates = [];
        this.isFetching = false;
      }, error => {
        console.log(error)
        this.isFetching = false;
        this.isError = true;
        this.error = error.message
      })
  }  

}
