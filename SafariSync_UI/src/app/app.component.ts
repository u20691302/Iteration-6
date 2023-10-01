import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserStoreService } from './services/user/user-store.service';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  currentRoute?: string;
  title = 'SafariSync_UI';

  public userRole: string = "";

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userStore: UserStoreService, private userService: UserService) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.activatedRoute.firstChild?.snapshot.routeConfig?.path;
      }
    });

    this.userStore.getRoleFromStore().subscribe(val => {
      let roleFromToken = this.userService.getRoleFromToken();
      this.userRole = val || roleFromToken;
    });

  }


}