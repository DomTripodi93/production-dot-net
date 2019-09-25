import { Component, OnInit, Input } from '@angular/core';
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
  @Input() partInput;
  isFetching = false;
  isError = false;
  error = '';
  part: Part;
  partNum = "";
  id = '';
  subscriptions: Subscription[] = [];

  constructor(
    private partServ: PartService,
    private route: ActivatedRoute,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    if (this.partInput){
      this.partNum = this.partInput;
      this.getPart();
    } else {
      this.subscriptions.push(
        this.route.params.subscribe((params: Params) =>{
          this.partNum = params['part'];
          this.getPart();
        })
      );      
    }
    this.subscriptions.push(
      this.partServ.partChanged.subscribe(()=>{
        this.getPart();
      })
    )
  }

  onDelete(part, id){
    if (confirm("Are you sure you want to delete " +part+ "?")){
      this.partServ.deletePart(id).subscribe(()=>{
        setTimeout(()=>{this.partServ.partChanged.next()},)}
      );
    }
  }

  getPart() {
    this.isFetching = true;
    this.partServ.fetchPart(this.partNum)
      .subscribe(part => {
        this.part = part;
        this.dayServ.dates = [];
        this.isFetching = false;
      }, error => {
        this.isFetching = false;
        this.isError = true;
        this.error = error.message
      }
    );
  } 

}
