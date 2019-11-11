import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductionService } from 'src/app/production/production.service';
import { Production } from '../production.model';

@Component({
  selector: 'app-production-single',
  templateUrl: './production-single.component.html',
  styleUrls: ['./production-single.component.css']
})
export class ProductionSingleComponent implements OnInit {
  production: Production;
  deleted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pro: ProductionService
  ) { }

  ngOnInit() {
    this.deleted = false;
    this.pro.proChanged.subscribe(()=>{
      if (!this.deleted){
        this.pro.fetchProductionById(this.production.id).subscribe(production=>{
          this.production = production;
        })
      }
    })
    this.route.params.subscribe((params: Params) =>{
      this.pro.fetchProductionById(params['id']).subscribe(production =>{
        this.production = production;
      })
    });
  } 

  onDelete(){
    if (confirm("Are you sure you want to delete this lot?")){
      this.pro.deleteProduction(this.production.id).subscribe(()=>{
        this.deleted = true;
        this.pro.proChanged.next();
      });
      this.router.navigate(["../.."], {relativeTo: this.route})
    }
  }

}
