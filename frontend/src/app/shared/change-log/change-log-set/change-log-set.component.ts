import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service';
import { map } from 'rxjs/operators';
import { Change } from '../../change.model';
import { PaginatedResult } from '../../pagination';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-change-log-set',
  templateUrl: './change-log-set.component.html',
  styleUrls: ['./change-log-set.component.css']
})
export class ChangeLogSetComponent implements OnInit {
  @Input() model: string
  set: any[] = [];
  logs: Change[] = []

  ngOnInit() {
    this.fetchChanges().subscribe((logs)=>{
      console.log(logs)
      this.logs = logs["change"]
      this.logs.forEach((log)=>{
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

  fetchChanges(page?, itemsPerPage?): Observable<PaginatedResult<Change[]>> {
    const paginatedResult: PaginatedResult<Change[]> = new PaginatedResult<Change[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null){
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    } else {
      params = params.append("pageNumber", "1");
      params = params.append("pageSize", "5");
    }

      return this.http.get(
        this.auth.apiUrl + '/changelog/' + this.model, { observe: "response", params })
        .pipe(
          map((responseData: any) => {
            paginatedResult.result = responseData.body;
            if (responseData.headers.get("Pagination") != null){
              paginatedResult.pagination = JSON.parse(responseData.headers.get("Pagination"));
            }
              return paginatedResult;
          })
        )
  }

}
