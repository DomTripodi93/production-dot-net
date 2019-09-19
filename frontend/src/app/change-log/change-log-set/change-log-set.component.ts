import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service';
import { map } from 'rxjs/operators';
import { Change } from '../../shared/change.model';

@Component({
  selector: 'app-change-log-set',
  templateUrl: './change-log-set.component.html',
  styleUrls: ['./change-log-set.component.css']
})
export class ChangeLogSetComponent implements OnInit {
  @Input() model: string
  set: any[] = [];

  ngOnInit() {
    this.fetchChanges().subscribe((logs)=>{
      logs.forEach((log)=>{
          let mod ={
            old: JSON.parse(log.oldValues),
            timeStamp: log.timeStamp.split("T"),
            type: log.changeType,
            id: log.changedId
          }

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

  constructor(
    private http: HttpClient,
    private auth: AuthService
    ) {}

  fetchChanges() {
      return this.http.get(
        this.auth.apiUrl + '/changelog/' + this.model
      )
      .pipe(
        map((responseData: Change[] = []) => {
        return responseData;
        })
      )
  }

}
