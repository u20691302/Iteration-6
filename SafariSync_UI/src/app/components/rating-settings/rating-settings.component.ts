import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RatingSettings } from 'src/app/models/user/ratingsettings.model';
import { UserService } from 'src/app/services/user/user.service';
import { NgToastService } from 'ng-angular-popup';
import { AbstractControl, ValidatorFn } from '@angular/forms'; // Import ValidatorFn and AbstractControl

@Component({
  selector: 'app-rating-settings',
  templateUrl: './rating-settings.component.html',
  styleUrls: ['./rating-settings.component.scss']
})
export class RatingSettingsComponent implements OnInit {
  ratingSettings: RatingSettings[] = [];

  updatedRatingSetting: RatingSettings = {
    ratingSettings_ID: 1,
    ratingSettings_Upper: 4,
    ratingSettings_Lower: 2
  };

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private toast: NgToastService,
  ) { }

  

  ngOnInit(): void {
    this.ratingSettings = [];
    this.fetchRatingSettings();
  }

  fetchRatingSettings(): void {
    this.userService.readAllRatingSettings().subscribe(
      (data: RatingSettings[]) => {
        this.ratingSettings = data;
        this.updatedRatingSetting = {
          ratingSettings_ID: this.ratingSettings[0].ratingSettings_ID,
          ratingSettings_Upper: this.ratingSettings[0].ratingSettings_Upper,
          ratingSettings_Lower: this.ratingSettings[0].ratingSettings_Lower
        };
        console.log(this.ratingSettings);
      },
      (error: any) => {
        console.error('Error fetching rating settings:', error);
      }
    );
  }

  updateRatingSetting(ratingID: number, updatedRatingSetting: RatingSettings): void {
    this.userService.updateRatingSettings(ratingID, updatedRatingSetting).subscribe(
      (data: RatingSettings) => {
        this.updatedRatingSetting = data;
        this.toast.success({ detail: "SUCCESS", summary: "Rating limits successfully updated", duration: 10000 });
        this.fetchRatingSettings();
      },
      (error: any) => {
        console.error('Error updating rating settings:', error);
        this.toast.error({ detail: "ERROR", summary: error.error, duration: 5000 });
      }
    );
  }
}
