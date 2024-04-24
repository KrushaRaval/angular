import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isValid: boolean = false;
  loggedInUser!: { email: string, password: string };

  constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.isValid = true;
    if (this.loginForm.valid) {

      console.log('Form submitted with values:', this.loginForm.value);

      this.auth.Login(this.loginForm.value).subscribe((res) => {
        console.log(res, "res")
        if(res){
          console.log(res,"res")
          localStorage.setItem("token",res.token)
          this.router.navigate(['/calendar']);
        }
      })
    }
  }

  toggleLoginForm() {
    this.router.navigate(['/signup']);
  }
} 