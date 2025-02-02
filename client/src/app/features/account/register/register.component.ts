import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard } from '@angular/material/card';
import { JsonPipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { TextInputComponent } from "../../../shared/components/text-input/text-input.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatCard,
    MatButton,
    JsonPipe,
    TextInputComponent
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registrationForm: any;
  validationErrors?: string[];

  constructor(
    public router: Router,
    public accountService: AccountService,
    public fb: FormBuilder,
    public snackbarService: SnackbarService
  ) {
    this.initializeRegistrationForm();
  }

  initializeRegistrationForm() {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.accountService.register(this.registrationForm.value).subscribe({
      next: () => {
        this.snackbarService.success("Registration successful - you can now login");
        this.router.navigateByUrl("/account/login");
      },
      error: errors => this.validationErrors = errors
    })
  }
}
