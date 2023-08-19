import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-navbarstuff', 
  templateUrl: './navbarstuff.component.html',
  styleUrls: ['./navbarstuff.component.scss']
})

//Displaying the help video modal


export class NavbarstuffComponent {

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  openModal(content: any): void {
    this.modalService.open(content, { size: 'lg' }) ;
  }

}



