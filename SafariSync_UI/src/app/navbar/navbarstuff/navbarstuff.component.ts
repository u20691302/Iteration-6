import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbarstuff',
  templateUrl: './navbarstuff.component.html',
  styleUrls: ['./navbarstuff.component.scss']
})
export class NavbarstuffComponent implements OnInit {
  @ViewChild('videoModal', { static: true }) videoModal!: TemplateRef<any>;
  private currentPage: string = '';
  videoSrc: string = ''; // Declare the videoSrc property here

  constructor(
    private modalService: NgbModal,
    private router: Router
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPage = this.getCurrentPage((event as NavigationEnd).url);
        this.videoSrc = this.getVideoSrcForPage(); // Set the video source when the page changes
      });
  }
  ngOnInit(): void {}

  openModal(): void {
    const videoSrc = this.getVideoSrcForPage();
    this.modalService.open(this.videoModal, { size: 'lg' });
    this.setVideoSource(videoSrc);
  }

  private getVideoSrcForPage(): string {
    if (this.currentPage === 'page') {
      return '/assets/Videos/Page.mkv';
    } else if (this.currentPage === 'dashboard') {
      return '/assets/Videos/Dashboard.mp4';
    }else if (this.currentPage === 'myprofile') {
      return '/assets/Videos/Profile.mkv';
    }else if (this.currentPage === 'scheduleActivity') {
      return '/assets/Videos/Scheduling.mp4';
    }else if (this.currentPage === 'activity') {
      return '/assets/Videos/Activity.mkv';
    }else if (this.currentPage === 'skills') {
      return '/assets/Videos/Skill.mkv';
    }else if (this.currentPage === 'users') {
      return '/assets/Videos/User.mkv';
    }else if (this.currentPage === 'send-registration-link') {
      return '/assets/Videos/Link.mkv';
    }else if (this.currentPage === 'toolbox') {
      return '/assets/Videos/Toolbox.mkv';
    }else if (this.currentPage === 'equipment') {
      return '/assets/Videos/Equip.mkv';
    }else if (this.currentPage === 'stock') {
      return '/assets/Videos/Stock.mkv';
    }else if (this.currentPage === 'suppliers') {
      return '/assets/Videos/Supplier.mkv';
    }else if (this.currentPage === 'contractors') {
      return '/assets/Videos/Contractor.mkv';
    }else if (this.currentPage === 'reporting') {
      return '/assets/Videos/GenerateReport.mkv';
    }else if (this.currentPage === 'userReport') {
      return '/assets/Videos/GenerateReport.mkv';
    }else if (this.currentPage === 'stockReport') {
      return '/assets/Videos/GenerateReport.mkv';
    } else if (this.currentPage === 'equipmentReport') {
      return '/assets/Videos/GenerateReport.mkv';
    }else if (this.currentPage === 'inventoryReport') {
      return '/assets/Videos/GenerateReport.mkv';
    }else if (this.currentPage === 'performanceReport') {
      return '/assets/Videos/GenerateReport.mkv';
    }else if (this.currentPage === 'personnelReport') {
      return '/assets/Videos/GenerateReport.mkv';
    }else if (this.currentPage === 'previousReport') {
      return '/assets/Videos/PreviousReport.mkv';
    }else if (this.currentPage === 'ratingSettings') {
      return '/assets/Videos/Rating.mp4';
    }else if (this.currentPage === 'timeout-settings') {
      return '/assets/Videos/Timeout.mp4';
    }else if (this.currentPage === 'audit') {
      return '/assets/Videos/Audit.mp4';
    
    
    }else {
      return '/assets/Videos/DefaultVideo.mp4';
    }
    

  }

  private getCurrentPage(url: string): string {
    const parts = url.split('/');
    if (parts.length > 1) {
      return parts[1];
    }
    return '';
  }

  private setVideoSource(src: string): void {
    const videoElement = document.querySelector('#videoElement') as HTMLVideoElement;
    if (videoElement) {
      videoElement.src = src;
      videoElement.load();
    }
  }
}
