import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})


//Displaying the help video modal

export class HelpComponent implements OnInit {
  constructor(private modalService: NgbModal, private route: ActivatedRoute, private userService: UserService) {}


  public savedRoute: string = "shap";  // Variable to store the saved route


  ngOnInit(): void {

    this.route.url.subscribe(urlSegments => {
      this.savedRoute = urlSegments.join('/'); // Convert URL segments to a string
      console.log("THE ROUTE IS:", this.savedRoute)
      this.userService.setCurrentPath(this.savedRoute);
    });

  }

  openModal(content: any): void {
    this.modalService.open(content, { size: 'lg' }) ;
  }
}