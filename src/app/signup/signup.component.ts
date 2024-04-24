  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { Router } from '@angular/router';
  import { AuthService } from '../auth.service';

  @Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
  })
  export class SignupComponent implements OnInit {
    signupForm!: FormGroup;
    isValid: boolean = false;

    constructor(private formBuilder: FormBuilder, private router: Router, private auth:AuthService) { }

    ngOnInit(): void {
      // Initialize the signupForm
      this.signupForm = this.formBuilder.group({
        userName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        userRole:['', [Validators.required]]
      });
    }

    onSubmit() {
      this.isValid = true;
      if (this.signupForm.valid) {
        const newUser = {
          userName: this.signupForm.value.userName,
          email: this.signupForm.value.email,
          password: this.signupForm.value.password,
          confirmPassword: this.signupForm.value.confirmPassword,
          userRole : this.signupForm.value.userRole
        };

        console.log('Form submitted with values:', this.signupForm.value);

        this.auth.signup(newUser).subscribe((res)=>{
          console.log(res,"res")
        })
      }
    }
    
    toggleLoginForm(){
      this.router.navigate(['/login']);
    }
  }