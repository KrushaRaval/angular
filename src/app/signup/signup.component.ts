import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  editForm!: FormGroup;
  signedUpUsers: { name: string, email: string, password: string, fields: { label: string, type: string }[] }[] = [];
  isValid: boolean = false;
  editingIndex: number = -1;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // Initialize the signupForm
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fields: this.formBuilder.array([])
    });

    // Initialize the editForm
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fields: this.formBuilder.array([])
    });

    // Clear existing fields to prevent duplicates
    this.clearFields();

    // Retrieve signed-up users from localStorage on component initialization
    const savedUsers = localStorage.getItem('signedUpUsers');
    if (savedUsers) {
      this.signedUpUsers = JSON.parse(savedUsers);
      // Update form array with stored fields
      this.signedUpUsers.forEach(user => {
        user.fields.forEach(field => {
          // Check if the field already exists in the form array
          const existingFieldIndex = this.fields.value.findIndex(
            (f: { label: string; type: string; }) => f.label === field.label && f.type === field.type
          );
          if (existingFieldIndex === -1) {
            this.addFields();
            const fieldGroup = this.fields.at(this.fields.length - 1) as FormGroup;
            fieldGroup.patchValue(field);
          }
        });
      });
    }
  }

  // Method to clear existing fields from the form array
  clearFields() {
    while (this.fields.length !== 0) {
      this.fields.removeAt(0);
    }
  }

  // Getter for form array
  get fields(): FormArray {
    return this.signupForm.get('fields') as FormArray;
  }

  // Method to add a new item to the form array
  addFields() {
    this.fields.push(this.createItem());
  }

  // Method to remove an item from the form array
  removeFields(index: number) {
    this.fields.removeAt(index);
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      label: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  onSubmit() {
    this.isValid = true;
    if (this.signupForm.valid) {
      const newUser = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        fields: this.signupForm.value.fields
      };
      this.signedUpUsers.push(newUser);

      // Save signed-up users to localStorage
      localStorage.setItem('signedUpUsers', JSON.stringify(this.signedUpUsers));

      console.log('Form submitted with values:', this.signupForm.value);
    }
  }

  clearTable() {
    this.signedUpUsers = [];
    localStorage.removeItem('signedUpUsers');
  }

  editUser(index: number) {
    this.editingIndex = index;
    const user = this.signedUpUsers[index];
  
    // Populate editForm with user's data
    this.editForm.patchValue({
      name: user.name,
      email: user.email,
      password: user.password,
    });
  
    // Clear existing fields to prevent duplicates
    this.clearEditFields();
  
    // Add user's fields to the editForm array
    user.fields.forEach(field => {
      this.addEditField(field.label, field.type);
    });
  }
  
  
  addEditField(label: string, type: string) {
    this.editFields.push(this.createEditField(label, type));
  }
  
  createEditField(label: string, type: string): FormGroup {
    return this.formBuilder.group({
      label: [label, Validators.required],
      type: [type, Validators.required]
    });
  }
  

  clearEditFields() {
    while (this.editFields.length !== 0) {
      this.editFields.removeAt(0);
    }
  }

  get editFields(): FormArray {
    return this.editForm.get('fields') as FormArray;
  }

  addEditFields() {
    this.editFields.push(this.createItem());
  }

  onEditSubmit() {
    if (this.editForm.valid) {
      const editedUser = this.editForm.value;
      
  
      // Update user in the signedUpUsers array
      this.signedUpUsers[this.editingIndex] = editedUser;
  
      // Save updated signed-up users to localStorage
      localStorage.setItem('signedUpUsers', JSON.stringify(this.signedUpUsers));
  
      // Reset editingIndex to indicate that no user is being edited
      this.editingIndex = -1;
  
      // Clear the edit form
      this.editForm.reset();
  
      console.log('User edited:', editedUser);
    }
  }

  cancelEdit() {
    this.editingIndex = -1;
    this.editForm.reset();
    this.clearEditFields();
  } 
  
  removeEditFields(index: number) {
    this.editFields.removeAt(index);
  }

  deleteUser(index: number) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.signedUpUsers.splice(index, 1);
      // Update localStorage
      localStorage.setItem('signedUpUsers', JSON.stringify(this.signedUpUsers));
    }
  }
}
