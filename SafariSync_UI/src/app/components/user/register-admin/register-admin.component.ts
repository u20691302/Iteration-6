import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';


import { Skills } from 'src/app/models/skills/skills.model';
import { User } from 'src/app/models/user/user.model';
import { SkillService } from 'src/app/services/skills/skills.service';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.scss']
})
export class RegisterAdminComponent {
  user: User = {
    user_ID: 123, // Replace with the actual user ID
    rating_ID: 456, // Replace with the actual rating ID
    username: '',
    password: '',
    surname: '',
    email: '',
    idPassport: '',
    cellphone: '',
    role: '',
    profileImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQACWAJYAAD/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDIBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/CABEIAMgAyAMBIgACEQEDEQH/xAAwAAEAAwADAQEAAAAAAAAAAAAABgcIAgQFAwEBAQEBAAAAAAAAAAAAAAAAAAABAv/aAAwDAQACEAMQAAAAv8AAAAAAAAAAAAAAAAB+UsWzA869db89bNo2d6OKLtLqfn6gAAAAAAAjRV9K8uLQAAF1XriLXCSUIAAAAAAo28s3FYhoAABdtJWcmkQgAAAAADPWha0M1hoAABbVS6USywgAAAAAD5/QZJi2wsurHwoAkB2dZeN7rIAAAAAAD5fDMZaFgY49NbkrucTkzz6ugvOIlaFR1QXnaeJZsapdPuIAAAAA48quKxr8aAAAAAsDTuItHJaIQAAABknTuOVBQAAAAEpiw2+8b2WQAAAIHlzUuWlBQAAAAANRzyCzpkAAADhmPT/ExE0bU6wpz4KAAAc5kQqwLNtBPzmIAAAAAB1IvMxWPnW+Kb+tvisfbmY6nbAAAAAAAAAAAAAAAAAD/8QARxAAAgECAgUGCQYMBwAAAAAAAQIDBAUGEQAHITGBEhMwQVFhFCIyQlJxkaHBCBUgQHKxEBYYNUNQU2KCkrLCFyNzdJOi0f/aAAgBAQABPwD9eXa/WqxU/hF0r6ekj6jNIFz9Q3nhpcNeeE6RmSlWuriNzRQ8lTxcj7tPygrXyvzDXcnt52PP2aW7XnhOrZUqlrqEne0sPKUcUJ+7S0361X2n8Itdwp6yLrMMgbL1jeOP1NmCgkkADaSdMe66hTSy2zCzJJIuayXBhykU9YjHnfaOzsz36V1fV3OrerrqqapqXPjSzOWY8T9Chr6u2ViVdDVTU1QnkywuVYcRpgLXSKmWK2YqZI5GyWO4KOSjHqEg3L9obO3LforBwCCCDtBH1HXJrEkeebC1pmKoni18yHax/ZA9npezt6DU3rEkSeHC12mLI/i0Eznap/ZE9no+zs+oY9xIMKYQrbmpHhAXm6cHrlbYvs38NJJHlleSR2eR2LM7HMsTtJPf0EcjxSJJG7JIjBldTkVIOYI7xpgLEgxXg+iubEeEFebqAOqVdje3fx6f5QN0YvZbQrELlJVSDtPkL/d0XyfrowkvNoZiVyjqox2HyG/t6fXtIz4+hU7koIwOLOei1EyMmPplG56CQHgyHp9f1E0eKbZW5eJPRmPPvRz8HHRagaJpMU3Oty8SCjEefe7j4Ien122BrtgkV8KFprZJz5y382dj+zYf4ei1JWBrTgrw+ZCs1zk58A7+bA5KfE8ennhjqYJIZUV45FKOjDMMpGRB0x9g+fBuJJaMqzUMpMlHKfOj9En0l3HgevoMA4PnxniSKjCstDFlJWSjzY8/JB9Jtw4nq0ghjpoI4YkVIo1CIijIKoGQA4fUMWYUt2L7K9uuCEedFMo8eF+pl+I6xpizBt2wfcTTXGHOJyeYqkB5uYdx6j2qdo9/0sJ4Nu2MLiKa3Q5RIf8APqnB5uEd56z2KNp9+mE8KW7CFlS3W9CfOlmYePM/WzfAdQ+oVFTDSQPPUSpFDGpZ5JGCqoHWSd2lfr2sdPf46SmpJ6m3AlZq1dmXeiHaw9ndnpHLY8YWMlTS3K21AyOYDq3rHURwI0xHqFpp3efDtwNMTt8Gqs3Qepx4w456XHVRjS3MQbK9So8+lkWQHhnn7tPxHxZyuT+LV1z/ANq3/mlu1U40uLALZXplO96qRYwOGZPu0w3qFpoXSfEVw8JI2+DUuaIfW58Y8MtJJbHg6x8pzS22204yAACKPUOsniTpQa9rHUX+SkqaSeltxIWGtfbn3ug2qO8Z9+WlPUw1cCT08qSwyKGSRGDKwO4gjf010ulHZbbPcK+dIKWBeVJIx2AfEncB16Y/1jXDGdW0EZems8bZxU2e18tzSdp7tw9e38FkxFd8OVnhVor5aWQ+UEOav3Mp2Nx0sWv6RFSK/wBp5ZG+eibL2ox+46UOuHBNagLXU0rejUwuhHHIj36f4kYM5Of4yW7L/W0rtcOCaJCVupqmHm00DufbkB79L9r+kdHisFp5BOwT1rZ+xF+J0veIrviOs8Ku9fLVSDyQ5yVO5VGxeH4MA6xrhgyrWCQvVWeRs5aXPana0fYe7cfXt0tV0o71bYLhb50npZ15UcinYR8D1EdXSO4RSzEADaSerTWjj58WXg0VFKfmajciIDYJ3GwyHu9Hu29f0sz2/S1XY+fCd5FFWyn5mrHAlB2iBzsEg7upu7b1aI4dQykEHaCDv6PXVi5rLh1LNSScmsuQKuVO1IR5R/i8n29NqVxc15w69nq5C1ZbQFQscy8J8n+XyfZ0R01i384jxzcqxX5VPHJ4PT9nNpszHrOZ49Nq6v5w5ji21jPyaeSQU9R2c2+wk+o5HhoOhxbc/mbCV2uIOTU9LI6H97k5L7yNNvWcz1nptvUcj1HTCVz+ecJWm4k5tUUsbuf3uSA3vB6HXHUGDVncwP0rRR8DIuf3fUNTlQZ9WVsBOfNNLHwEjZff0Ot6glr9W1yEKlmgMdQQOtUYFvdmeH1DVBQS0Gra2iZSrTmSoAPUrsSvuyPHoZYknieKRVeN1KsrDMMDsIOmsbVrWYSrJa6hieaySNmkgGZp8/Mfu7G3du3f0urnVrWYtrIq6uieGyRtm8hGRqMvMTu7W3dm3dFEkESRRqqRooVVUZBQNgA6KSNJY2jkUMjDJlYZgjsI0xTqSsd2Z6mzym1VLZnkIvKgY/Z3rwOXdpe9VGL7IzMbYa6AfpaI84Mvs7GHs0mhkppTFPG8Ug3pIpVhwPQQwyVMoigjeaQ7kjUsx4DSyaqMX3sqwthoYD+lrTzez7O1j7NMLakbJaWSpvEputSuR5DryYFP2d7cTl3aRxpFGscahUUZKqjIAdgHS5aVtroLlHzddRU9UnozxK4940rdVOCq4sz2KCJj51OzRf0kDSo1E4SlzMUtygPVyKgMP+ynST5P9lYnm71cV9axn4afk+23P8/1v/DHpH8n+yqRzl6uLepYx8NKfUThKLIyy3Kc/v1AUH+VRpRaqcFUJDJYoJWHnVDNL/USNKK2UFtj5uhoqelT0YIlQe4aZfrr/8QAFBEBAAAAAAAAAAAAAAAAAAAAcP/aAAgBAgEBPwAp/8QAGhEAAwADAQAAAAAAAAAAAAAAAREwABAgQP/aAAgBAwEBPwDxLFisYDk1MRVaelY9Cos+n7v/2Q==',
    idImage: '',
    regDate: new Date()
  };

  selectedSkill: number | null = null;
  skills: Skills[] = [];
  addUpdateSkills: Skills[] = [];
  isSkillListEmpty: boolean = true;

  form: FormGroup;
  imagePreview: string | undefined;
  selectedImageName: string | undefined;
  selectedImage: any;

  constructor(private userService: UserService, private router: Router, private toast: NgToastService, private skillService: SkillService) {
    this.form = new FormGroup({
      Username: new FormControl('', [Validators.required, Validators.minLength(2)]),
      Surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      IdPassport: new FormControl('', [Validators.required, Validators.pattern(/(([0-9]{2})(0|1)([0-9])([0-3])([0-9]))([ ]?)(([0-9]{4})([ ]?)([0-1][8]([ ]?)[0-9]))/)]),
      Email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9.%+-~]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
      Cellphone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
      Password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{5,}$')]),
      Role: new FormControl('', [Validators.required, Validators.minLength(3)]),
      IdImage: new FormControl(''),
      Skill: new FormControl('')
    });
  }

  ngOnInit(){
    this.getSkills();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageName = file.name;
      this.selectedImage = file; // Store the selected file
      const reader = new FileReader();
      reader.onload = () => {
        this.user.idImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  registerAdmin() {
    this.user.skills = this.addUpdateSkills;
    this.userService.registerUser(this.user).subscribe(
      response => {
        // Handle successful registration response
        this.router.navigate(['/login']);
        this.toast.success({detail: "SUCCESS", summary: "Registered Successfully!", duration: 5000})

      },
      error => {
        // Handle registration error
        console.error(error); // Log the error or display an error message
  
        // Log specific error properties if available
        this.toast.error({detail: "ERROR", summary: error.error, duration: 5000})

      }
    );
  }


  togglePasswordVisibility() {
    const passwordInput = document.getElementById('Password') as HTMLInputElement;
    const eyeIcon = document.querySelector('.toggle-password') as HTMLElement;
  
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

  addSkillToArray() {
    if (this.selectedSkill) {
      const skillToAdd = this.skills.find(supplier => supplier.skill_ID === Number(this.selectedSkill));
      if (skillToAdd) {
        this.addUpdateSkills.push(skillToAdd);
        console.log(this.addUpdateSkills);
        this.selectedSkill = null;
        this.isSkillListEmpty = this.addUpdateSkills.length === 0;
      }
    }
  }

  getSkills() {
    this.skillService.readAllSkills().subscribe(
      (skills) => {
        this.skills = skills;
      },
      (error) => {
        // Handle the error, e.g., show an error message.
        console.error(error);
      }
    );
  }

  deleteSkillFromArray(skill: Skills) {
    const index = this.addUpdateSkills.findIndex(s => s.skill_ID === skill.skill_ID);
    if (index !== -1) {
      this.addUpdateSkills.splice(index, 1);
    }
    this.isSkillListEmpty = this.addUpdateSkills.length === 0;
  }
}