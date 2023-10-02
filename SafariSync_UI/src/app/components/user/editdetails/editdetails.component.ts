import { Component, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserStoreService } from 'src/app/services/user/user-store.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { User } from 'src/app/models/user/user.model';
import { Skills } from 'src/app/models/skills/skills.model';
import { SkillService } from 'src/app/services/skills/skills.service';


@Component({
  selector: 'app-editdetails',
  templateUrl: './editdetails.component.html',
  styleUrls: ['./editdetails.component.scss']
})
export class EditdetailsComponent {
  confirmationModal: NgbModalRef | undefined; // Reference to the confirmation modal
  public selectedImageURL: string | ArrayBuffer | null = null;

  public newProfileImage: string = "has to work";
  public newIdImage: string = "has to work";


  user: User | undefined;

  public fullName:string ="";
  public surname:string ="";
  public idPassport: string = "";
  public email: string = "";
  public cellphone: string = "";
  public userId: string = "";
  public profileImage: string = "";

  public selectedFileName: string | null = null;
  public selectedImageBase64: string | null = null;

  public editedFullName:string ="";
  public editedSurname:string ="";
  public editedIdPassport: string = "";
  public editedEmail: string = "";
  public editedCellphone: string = "";
  photoConfirmationModal: NgbModalRef | undefined;
  idPhotoConfirmationModal: NgbModalRef | undefined;


  userSkills: Skills[] = [];
  isSkillListEmpty: boolean = true;
  skills: Skills[] = [];
  selectedSkill: number | null = null;

  @ViewChild('content') updateModal: any; // Reference to the update modal
  @ViewChild('successModal') successModal: any; // Reference to the success modal
  @ViewChild('photoSuccessModal') photoSuccessModal: any; // Reference to the success modal
  @ViewChild('photoConfirmationModal') photoConfirmationModalTemplate!: TemplateRef<any>;
  @ViewChild('idPhotoConfirmationModal') idPhotoConfirmationModalTemplate!: TemplateRef<any>;

  @ViewChild('fileInput') fileInputRef!: ElementRef;

  form: FormGroup; // Add this line

  constructor(private router: Router, private userService: UserService, private modalService: NgbModal, private userStore:UserStoreService, private fileInput: ElementRef, private sanitizer: DomSanitizer, private skillService: SkillService) {
    this.form = new FormGroup({
      Username: new FormControl('', [Validators.required, Validators.minLength(2)]),
      Surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      IdPassport: new FormControl('', [Validators.required, Validators.pattern(/(([0-9]{2})(0|1)([0-9])([0-3])([0-9]))([ ]?)(([0-9]{4})([ ]?)([0-1][8]([ ]?)[0-9]))/)]),
      Email: new FormControl('', [Validators.required, Validators.minLength(5)]),
      Cellphone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      Skill: new FormControl('')
    });
  }

  //method to get all user info from token
  getAllUserInfo(){
    //get name
    this.userStore.getFullNameFromStore()
    .subscribe(val =>{
      let fullNameFromToken = this.userService.getFullNameFromToekn();
      this.fullName = val || fullNameFromToken
    })

    //get surname
    this.userStore.getSurnameFromStore()
    .subscribe(val =>{
      let surnameFromToken = this.userService.getSurnameFromToken();
      this.surname = val || surnameFromToken
    })

    //get Id number
    this.userStore.getIdNumFromStore()
    .subscribe(val =>{
      let idFromToken = this.userService.getIdNumberFromToken();
      this.idPassport = val || idFromToken
    })

    //get email
    this.userStore.getEmailFromStore()
    .subscribe(val =>{
      let emailFromToken = this.userService.getEmailFromToken();
      this.email = val || emailFromToken
    })

    //get cellNum
    this.userStore.getCellphoneFromStore()
    .subscribe(val =>{
      let cellFromToken = this.userService.getCellFromToken();
      this.cellphone = val || cellFromToken
    })

    this.userStore.getUserIdFromStore()
    .subscribe(val =>{
      let theUserId = this.userService.getUserIdFromToken();
      this.userId = val || theUserId
    })

    this.userStore.getProfileImageFromStore().subscribe(val => {
      let profileImageFromToken = this.userService.getProfileImageFromToken();
      this.profileImage = val || profileImageFromToken;
      this.profileImage = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + this.profileImage) as string;
      console.log("the profile image base 64 is", this.profileImage);
    });

    const userIdInt = parseInt(this.userId, 10);
    this.skillService.getUserSkills(userIdInt).subscribe(
      (data) => {
        this.userSkills = data;
        console.log(this.userSkills);
        // Do something with the userSkills data, e.g., update your component's UI
      },
      (error) => {
        console.error('Error fetching user skills:', error);
        // Handle the error as needed
      }
    );
  }

  //trying to get the data from the token as the page loads
  ngOnInit(){
    this.getAllUserInfo();
    this.getSkills();
  }


  openModal(content: any) {
    this.modalService.open(content, { centered: true, backdrop: 'static'});
  }

  openConfirmationModal(confirmationModal: any) {
    this.confirmationModal = this.modalService.open(confirmationModal, { centered: true });
  }

  saveUser(confirmationModal: any) {
    // Logic to save the user information
    this.editedFullName = this.fullName;
    this.editedSurname= this.surname;
    this.editedIdPassport  = this.idPassport;
    this.editedEmail = this.email;
    this.editedCellphone  = this.cellphone;

    this.openConfirmationModal(confirmationModal);
  }

  confirmUpdate() {
    // Code to handle confirmation of updated details
    //this.userService.updateUser(this.user);
    //the password and role dont matter because they are not being read in the backend API
    const updatedUser: User = {
      user_ID: 123, // Replace with the actual user ID
      rating_ID: 456, // Replace with the actual rating ID
      username: this.editedFullName,
      password: "needtochange",
      surname: this.editedSurname,
      email: this.editedEmail,
      idPassport: this.editedIdPassport,
      cellphone: this.editedCellphone,
      role: "needtochangerole",
      profileImage: "mytextdoggggg",
      idImage: "idimagestringfornow",
      skills: this.userSkills,
      regDate: new Date()
    };    
    
    console.log("the id is" , this.userId);
    const userIdInt = parseInt(this.userId, 10);

    this.userService.updateUser(userIdInt, updatedUser)
      .subscribe(
        response => {
          console.log("User updated successfully:", response);

          // Update the jwt token somehow 
          this.userService.storeToken(response.token);
          let tokePayload = this.userService.decodedToken();
          this.userStore.setFullNameForStore(tokePayload.unique_name);
          this.userStore.setRoleForStore(tokePayload.role);
          this.userStore.setSurnameFromStore(tokePayload.family_name);
          this.userStore.setIdNumFromStore(tokePayload.certserialnumber);
          this.userStore.setEmailFromStore(tokePayload.email);
          this.userStore.setCellPhoneFromStore(tokePayload.cellphone);
          this.userStore.setUserIdFromStore(tokePayload.userid);

        },
        error => {
          console.error("Error updating user:", error);
        }
      );

    if (this.confirmationModal) {
      this.confirmationModal.close('Close click');
      this.modalService.open(this.successModal, { centered: true });
    }
  }

  cancelUpdate() {
    // Code to handle cancellation of updated details
    if (this.confirmationModal) {
      this.confirmationModal.dismiss('Close click');
      this.openModal(this.updateModal); // Reopen the update modal
    }
  }

  //closes the edit modal and resets the local variables
  closeEditModal(){
    
    this.getAllUserInfo();
  }



  //photo stuff 21 July
  //////////////////////////////////////////
  /////////////////////////////////////////
  //////////////////////////////////////////
  /////////////////////////////////////////
  //////////////////////////////////////////
  /////////////////////////////////////////

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput.files;

    if (files && files.length > 0) {
      const selectedFile = files[0];
      this.selectedFileName = selectedFile.name;
      this.showConfirmationModal(selectedFile);
    }
  }

  // Method to open the confirmation modal with the selected file
  showConfirmationModal(selectedFile: File) {
    console.log("showConfirmationModal method called");
  
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      this.selectedImageURL = reader.result as string;
  
      // Store the base64 data in the selectedImageBase64 property
      this.selectedImageBase64 = reader.result?.toString() || null;
  
      // Use the template reference for modal content
      this.photoConfirmationModal = this.modalService.open(this.photoConfirmationModalTemplate, { centered: true });
    };
  
    reader.onerror = () => {
      this.selectedImageURL = null;
    };
  }
  

  confirmPhotoUpdate() {
    // Check if selectedImageBase64 is empty or invalid
    const imageBase64 = this.selectedImageBase64 ? this.selectedImageBase64 : '';
    if (!imageBase64) {
      console.error("No image data found.");
      return;
    }
  
    // Create a Blob with the raw binary data from the base64 string
    const blob = this.dataURItoBlob(imageBase64);
  
    // Create FormData and append the Blob with the correct field name "newProfilePhoto"
    const formData = new FormData();
    formData.append("newProfilePhoto", blob, "profile.png"); // "newProfilePhoto" is the name expected by the backend
  
    // Get the user ID
    const userIdInt = parseInt(this.userId, 10);
  
    // Send the FormData to update the profile image
    this.userService.updateProfileImage(userIdInt, formData).subscribe(
      response => {
        // Password updated successfully, handle the response if needed
        // Update the jwt token somehow
        this.userService.storeToken(response.token);
        let tokePayload = this.userService.decodedToken();
        this.userStore.setProfileImageFromStore(tokePayload.profileImage);
        this.getAllUserInfo();
        console.log(response);
        if (this.photoConfirmationModal) {
          this.photoConfirmationModal.close('Close click');
          this.modalService.open(this.photoSuccessModal, { centered: true });
        }
      },
      error => {
        // Handle the error if the photo update fails
        console.error(error);
      }
    );
  }

  // Helper function to convert data URI to Blob
  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([uint8Array], { type: mimeString });
  }
  
  

  // Method to handle cancellation of the photo update
  cancelPhotoUpdate() {
    if (this.photoConfirmationModal) {
      this.photoConfirmationModal.dismiss('Close click');
      this.selectedImageURL = null;
      this.photoConfirmationModal = undefined;
  
      // Reset the file input to trigger the change event again
      this.resetFileInput().then(() => {
        this.openFileExplorer();
      });
    }
  }
  

  resetFileInput(): Promise<void> {
    return new Promise((resolve) => {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ''; // Clear the selected file
      }
      resolve();
    });
  }

  openFileExplorer() {
    this.fileInputRef.nativeElement.click();
    
  }


  ///////////////////////////
  /////////////////////////
  ////////////////////////
  ///////////////////////
  //id image stuff
  public selectedIdImageURL: string | ArrayBuffer | null = null;

  public editedIdImage: string = ""; // Initialize the editedIdImage variable

  onIdImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput.files;

    if (files && files.length > 0) {
      const selectedFile = files[0];
      this.selectedFileName = selectedFile.name;
      this.showIdImageConfirmationModal(selectedFile);
    }
  }


  // Method to open the confirmation modal with the selected id image
  showIdImageConfirmationModal(selectedFile: File) {
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      this.selectedIdImageURL = reader.result as string;
      // Store the base64 data in the editedIdImage property
      this.editedIdImage = reader.result?.toString() || "";
      // Use the template reference for modal content
      this.idPhotoConfirmationModal = this.modalService.open(this.idPhotoConfirmationModalTemplate, { centered: true });
    };
    reader.onerror = () => {
      this.selectedIdImageURL = null;
    };
  }


  // Method to confirm the id image update
  confirmIdImageUpdate() {
    // Check if editedIdImage is empty or invalid
    const idImageBase64 = this.editedIdImage ? this.editedIdImage : '';
    if (!idImageBase64) {
      console.error("No id image data found.");
      return;
    }

    // Create a Blob with the raw binary data from the base64 string
    const blob = this.dataURItoBlob(idImageBase64);

    // Create FormData and append the Blob with the correct field name "newIdImage"
    const formData = new FormData();
    formData.append("newIdPhoto", blob, "idimage.png"); // "newIdImage" is the name expected by the backend

    // Get the user ID
    const userIdInt = parseInt(this.userId, 10);

    // Send the FormData to update the id image
    this.userService.updateIdImage(userIdInt, formData).subscribe(
      response => {
        // Id image updated successfully, handle the response if needed
        // Update the jwt token somehow
        this.userService.storeToken(response.token);
        let tokePayload = this.userService.decodedToken();
        this.userStore.setIdImageFromStore(tokePayload.idImage);
        // You can handle the response as needed, such as updating the UI or displaying a success message.
        console.log(response);
        if (this.idPhotoConfirmationModal) {
          this.idPhotoConfirmationModal.close('Close click');
          // You can open a success modal here if you want to notify the user of a successful update.
        }
      },
      error => {
        // Handle the error if the id image update fails
        console.error(error);
      }
    );
  }

  // Method to handle cancellation of the id image update
  cancelIdImageUpdate() {
    if (this.photoConfirmationModal) {
      this.photoConfirmationModal.dismiss('Close click');
      this.selectedIdImageURL = null;
      this.photoConfirmationModal = undefined;

      // Reset the file input to trigger the change event again
      this.resetFileInput().then(() => {
        this.openFileExplorer();
      });
    }
  }





















  deleteSkillFromArray(skill: Skills) {
    const index = this.userSkills.findIndex(s => s.skill_ID === skill.skill_ID);
    if (index !== -1) {
      this.userSkills.splice(index, 1);
    }
    this.isSkillListEmpty = this.userSkills.length === 0;
  }

  addSkillToArray() {
    if (this.selectedSkill) {
      const skillToAdd = this.skills.find(supplier => supplier.skill_ID === Number(this.selectedSkill));
      if (skillToAdd) {
        this.userSkills.push(skillToAdd);
        console.log(this.userSkills);
        this.selectedSkill = null;
        this.isSkillListEmpty = this.userSkills.length === 0;
      }
    }
  }

  getSkills() {
    this.skillService.readAllSkills().subscribe(
      (skills) => {
        console.log(skills);
        this.skills = skills;
      },
      (error) => {
        // Handle the error, e.g., show an error message.
        console.error(error);
      }
    );
  }
}