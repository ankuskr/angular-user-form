import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', [Validators.required, this.minAgeValidator(18)]],
      resStreet1: ['', Validators.required],
      resStreet2: ['', Validators.required],
      sameAsResidential: [false],
      permStreet1: [''],
      permStreet2: [''],
    });

    this.restoreFormState();

    this.userForm
      .get('sameAsResidential')
      ?.valueChanges.subscribe((checked) => {
        const permStreet1 = this.userForm.get('permStreet1');
        const permStreet2 = this.userForm.get('permStreet2');

        if (checked) {
          permStreet1?.clearValidators();
          permStreet2?.clearValidators();
        } else {
          permStreet1?.setValidators(Validators.required);
          permStreet2?.setValidators(Validators.required);
        }

        permStreet1?.updateValueAndValidity();
        permStreet2?.updateValueAndValidity();
      });

    this.userForm.valueChanges.subscribe(() => {
      localStorage.setItem(
        'userFormState',
        JSON.stringify(this.userForm.getRawValue())
      );
    });
  }

  get f() {
    return this.userForm.controls;
  }

  minAgeValidator(minAge: number) {
    return (control: AbstractControl) => {
      if (!control.value) return null;
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= minAge ? null : { tooYoung: true };
    };
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form Submitted:', this.userForm.getRawValue());
    }
  }

  resetForm() {
    this.userForm.reset();
    localStorage.removeItem('userFormState');
  }

  restoreFormState() {
    const saved = localStorage.getItem('userFormState');
    if (saved) {
      this.userForm.patchValue(JSON.parse(saved));
    }
  }
}
