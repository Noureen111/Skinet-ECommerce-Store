import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-test-error',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss'
})
export class TestErrorComponent {

  baseUrl: string = "https://localhost:5001/api/";
  validationErrors?: string[];

  constructor(
    private http: HttpClient
  ) {}

  get404Error() {
    this.http.get(this.baseUrl + "buggy/notfound").subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get400Error() {
    this.http.get(this.baseUrl + "buggy/badrequest").subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get401Error() {
    this.http.get(this.baseUrl + "buggy/unauthorized").subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get500Error() {
    this.http.get(this.baseUrl + "buggy/internalerror").subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + "buggy/validationerror", {}).subscribe({
      next: response => console.log(response),
      error: error => this.validationErrors = error
    })
  }
}
