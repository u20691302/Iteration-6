import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usernavbar',
  templateUrl: './usernavbar.component.html',
  styleUrls: ['./usernavbar.component.scss']
})
export class UsernavbarComponent {

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  openModal(content: any): void {
    this.modalService.open(content, { size: 'lg' }) ;
  }

}
