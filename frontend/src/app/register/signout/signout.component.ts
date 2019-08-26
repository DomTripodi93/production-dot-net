import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  onLogout(){
    this.auth.logout()
    this.router.navigate(["../login"], {relativeTo: this.route})
  }

  onCancel(){
    this.router.navigate(["../propage"], {relativeTo: this.route})
  }

}
