import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from 'src/app/services/user/user.service';
import { UserStoreService } from 'src/app/services/user/user-store.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Skills } from 'src/app/models/skills/skills.model';
import { SkillService } from 'src/app/services/skills/skills.service';
import { User } from 'src/app/models/user/user.model';
import { TimerService } from 'src/app/services/user/timer.service';


@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent {
  user: User | undefined;
  public users: any = [];
  public fullName: string = "";
  public userRole: string = "";
  public profileImage: string = "";
  public idImage: string = "";
  public rating: string = "";
  public userId: number = 0;
  public currentPassword: string = "";
  public newPassword: string = "";
  public newPasswordConfirm: string = "";
  confirmationModalRef: NgbModalRef | undefined; // Use a different variable name
  starsArray: number[] = [];
  MAX_STARS: number = 5;
  emptyStarsArray: number[] = [];
  userSkills: Skills[] = [];

  defaultImage = '/assets/default-profile-image.png';

  public savedRoute: string = "shap";  // Variable to store the saved route


  @ViewChild('updatePasswordModal') updatePasswordModal: any; // Reference to the update password modal
  @ViewChild('confirmationModal') confirmationModal: any; // Reference to the confirmation modal
  @ViewChild('successModal') successModal: any; // Reference to the success modal
  @ViewChild('idImageModal') IdImageModal: any; // Reference to the success modal
  @ViewChild('failedModal') failedModal: any;

  // Variables to track the success and failed modals
  successModalRef: NgbModalRef | undefined;
  failedModalRef: NgbModalRef | undefined;

  form: FormGroup; // Add this line
  newPassword2Matches: boolean = true; // Fix the property name


  constructor(private userService: UserService, private userStore: UserStoreService, private modalService: NgbModal, private sanitizer: DomSanitizer, private skillService: SkillService, private route: ActivatedRoute, private timerService: TimerService) {
    this.form = new FormGroup({
      CurrentPassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{5,}$')]),
      NewPassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{5,}$')]),
      NewPassword2: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{5,}$')])
    });
  }

  public isModalOpen: boolean = false;

  

  logout() {
    this.userService.logout();
  }

  ngOnInit() {
    this.userStore.getFullNameFromStore().subscribe(val => {
      let fullNameFromToken = this.userService.getFullNameFromToekn();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe(val => {
      let roleFromToken = this.userService.getRoleFromToken();
      this.userRole = val || roleFromToken;
      console.log("the role is", this.userRole);
    });

    this.userStore.getUserIdFromStore().subscribe(val => {
      let idFromToken = this.userService.getUserIdFromToken();
      this.userId = val || idFromToken;
      console.log("the id is", this.userId);
    });

    this.userStore.getProfileImageFromStore().subscribe(val => {
      let profileImageFromToken = this.userService.getProfileImageFromToken();

      let pi = val || profileImageFromToken;

      if (this.isValidBase64(pi)) {
          this.profileImage = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + pi) as string;
      } else {
          this.profileImage = 'assets/default-profile-image.png';
      }
    });

    this.userStore.getIdImageFromStore().subscribe(val => {
      let idImageFromToken = this.userService.getIdImageFromToken();
      this.idImage = val || idImageFromToken;
      this.idImage = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + this.idImage) as string;
      console.log("the ID image base 64 is", this.idImage);
    });

    this.userStore.getRatingFromStore().subscribe(val => {
      let ratingFromToken = this.userService.getRatingFromToken();
      this.rating = val || ratingFromToken;
    
      let ratingAsInt: number = parseInt(this.rating, 10);
      this.starsArray = Array(ratingAsInt).fill(0); // Fill the starsArray with zeros up to the ratingAsInt
    
      let emptyStars = this.MAX_STARS - ratingAsInt;
      this.emptyStarsArray = Array(emptyStars).fill(0); // Fill the emptyStarsArray with zeros up to the difference
      console.log("the rating is", ratingAsInt);
    });
    
    this.route.url.subscribe(urlSegments => {
      this.savedRoute = urlSegments.join('/'); // Convert URL segments to a string
      console.log("THE ROUTE IS:", this.savedRoute)
      this.userService.setCurrentPath(this.savedRoute);
    });
  }

  isValidBase64(str:string) {
    try {
        atob(str);
    } catch (e) {
        return false;
    }
    return true;
  }


  // Example usage in a method
  updateTimerTimeout(newTimeout: number): void {
    console.log(newTimeout);
    this.timerService.updateTimeout(newTimeout).subscribe(
      (response) => {
        console.log('Timeout updated successfully', response);
        // You can handle the response here if needed
        this.timerService.fetchTimeoutFromBackend();
        this.userService.handleTimerExpiration(); // Call this method in your component's ngOnInit
      },
      (error) => {
        console.error('Error updating timeout', error);
        // Handle errors here
      }
    );
  }

  openImageModal() {
    this.modalService.open(this.IdImageModal, { centered: true });
  }

  closeImageModal() {
    this.modalService.dismissAll();
  }

  openModal() {
    this.modalService.open(this.updatePasswordModal, { centered: true });
  }

  openConfirmationModal() {
    this.confirmationModalRef = this.modalService.open(this.confirmationModal, { centered: true });
  }

  savePassword() {
    // Testing to get the input from the modal
    console.log("Current Password:", this.currentPassword);
    console.log("New Password:", this.newPassword);
    console.log("New Password Confirm:", this.newPasswordConfirm);

    this.modalService.dismissAll();

    this.openConfirmationModal();
  }

  confirmUpdate() {
    // Call the updatePassword method in the UserService to send data to the database
    console.log("now we call the api");
    this.userService.updatePassword(this.userId, this.currentPassword, this.newPassword)
      .subscribe(
        response => {
          // Password updated successfully, handle the response if needed
          console.log(response);
          if (this.confirmationModalRef) {
            this.confirmationModalRef.close('Close click');
          }
          // Close all open modals
          this.modalService.dismissAll();
          // Open the success modal
          this.modalService.open(this.successModal, { centered: true });
          this.currentPassword = '';
          this.newPassword = '';
          this.newPasswordConfirm = '';
        },
        error => {
          // Handle the error if the password update fails
          console.error(error);
          if (this.confirmationModalRef) {
            this.confirmationModalRef.close('Close click');
          }
          // Close all open modals
          this.modalService.dismissAll();
          // Open the failed modal
          this.modalService.open(this.failedModal, { centered: true });
          // Clear the input values in the modal
          this.currentPassword = '';
          this.newPassword = '';
          this.newPasswordConfirm = '';
        }
      );
  }

  cancelUpdate() {
    if (this.confirmationModalRef) {
      this.confirmationModalRef.dismiss('Close click');
      this.openModal(); // Reopen the update password modal
    }
  }

  // Rest of the component code remains the same...
  onNewPassword2Change() {
    this.newPassword2Matches = this.newPassword === this.newPasswordConfirm;
  }

  togglePasswordVisibility(inputId: string, event: Event) {
    const passwordInput = document.getElementById('CurrentPassword') as HTMLInputElement;
    const eyeIcon = event.target as HTMLElement;
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  }

  togglePasswordVisibility1(inputId: string, event: Event) {
    const passwordInput = document.getElementById('NewPassword') as HTMLInputElement;
    const eyeIcon = event.target as HTMLElement;
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  }

  togglePasswordVisibility2(inputId: string, event: Event) {
    const passwordInput = document.getElementById('NewPassword2') as HTMLInputElement;
    const eyeIcon = event.target as HTMLElement;
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  }



}