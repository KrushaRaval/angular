import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signedUpUsers: { name: string, email: string, password: string, fields: { label: string, type: string }[] }[] = [];
  isValid: boolean = false;
  loggedInUser: { name: string, email: string, password: string, fields: { label: string, type: string }[] } | undefined;
  dynamicFields: { label: string, type: string, controlName: string }[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // Retrieve signed-up users from localStorage on component initialization
    const savedUsers = localStorage.getItem('signedUpUsers');
    if (savedUsers) {
      this.signedUpUsers = JSON.parse(savedUsers);
      this.extractDynamicFields();
      this.createDynamicControls();
    }
  }

  extractDynamicFields() {
    const allFields: { label: string, type: string }[] = [];
    this.signedUpUsers.forEach(user => {
      user.fields.forEach(field => {
        const existingFieldIndex = allFields.findIndex(f => f.label === field.label && f.type === field.type);
        if (existingFieldIndex === -1) {
          allFields.push(field);
        }
      });
    });
    this.dynamicFields = allFields.map((field, index) => ({
      ...field,
      controlName: `dynamic_${index}`
    }));
  }

  createDynamicControls() {
    const group: { [key: string]: any } = {};
    this.dynamicFields.forEach(field => {
      group[field.controlName] = ['', Validators.required];
    });
    this.loginForm.addControl('dynamicFieldsGroup', this.formBuilder.group(group));
  }

  get dynamicFieldsGroup() {
    return this.loginForm.get('dynamicFieldsGroup') as FormGroup;
  }

  onSubmit() {
    this.isValid= true;
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.loggedInUser = this.signedUpUsers.find(user => user.email === email && user.password === password);

      if (this.loggedInUser) {
        alert('Login successful!');
      } else {
        alert('Invalid email or password.');
      }
    }
  }
}
