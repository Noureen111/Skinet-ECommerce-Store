import { Component } from '@angular/core';
import { HeaderComponent } from "./layout/header/header.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  baseUrl = "https://localhost:5001/api/";
  title = 'Skinet';
  products: any[] = [];

  constructor(
    private http: HttpClient
  )
  {}

  ngOnInit() {
    this.http.get<any>(this.baseUrl + "products").subscribe({
      next: response => this.products = response.data,
      error: error => console.log(error),
      complete: () => console.log("completed")      
    });
  }
}
