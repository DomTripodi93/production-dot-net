import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service';
import { Change } from '../../change.model';
import { Pagination } from '../../pagination';

@Component({
  selector: 'app-change-log-set',
  templateUrl: './change-log-set.component.html',
  styleUrls: ['./change-log-set.component.css']
})
export class ChangeLogSetComponent implements OnInit {
  @Input() model: string;
  @Input() pageSize: number;
  set: any[] = [];
  logs: Change[] = [];
  pageNum: number = 1;
  pagination: Pagination;


  constructor(
    private http: HttpClient,
    private auth: AuthService
    ) {}

  ngOnInit() {
    if (!this.pageSize){
      this.pageSize = 5;
    }
    this.getChanges();
  }

  getChanges(){    
    this.auth.fetchChanges(this.model, this.pageNum, this.pageSize).subscribe((logs)=>{
      this.pageNum++;
      this.pagination = logs.pagination;
      this.logs = logs.result;
      this.logs.forEach((log)=>{
        let mod ={
          old: JSON.parse(log.oldValues),
          timeStamp: log.timeStamp.split("T"),
          type: log.changeType,
          id: log.changedId
        }
        console.log(mod.old)
        if (+mod.timeStamp[1].substring(0,2)>12){
          let timeHold = +mod.timeStamp[1].substring(0,2) - 12;
          mod.timeStamp[1] = timeHold + mod.timeStamp[1].substring(2, 5) + " PM"
        } else if (+mod.timeStamp[1].substring(0,2) == 0){
          let timeHold = +mod.timeStamp[1].substring(0,2) + 12
          mod.timeStamp[1] = timeHold + mod.timeStamp[1].substring(2, 5) + " AM"
        } else {
          let timeHold = +mod.timeStamp[1].substring(0,2)
          mod.timeStamp[1] = timeHold + mod.timeStamp[1].substring(2, 5) + " AM"
        }
        this.set.push(mod)
      })
    })
  }

  showMore(){
    this.getChanges();      
  }

}
