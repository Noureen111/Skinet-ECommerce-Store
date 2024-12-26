import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/Pagination';
import {   Product } from '../../shared/models/Product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  //Dependancy Injections
  private http = inject(HttpClient);

  //Variables
  baseUrl = "https://localhost:5001/api/";
  types: string[] = [];
  brands: string[] = [];
  

  getProducts(types?: string[], brands?: string[], sort?: string) {

    let params = new HttpParams();
    if(types && types.length > 0) {
      params = params.append("types", types.join(","));
    }

    if(brands && brands.length > 0) {
      params = params.append("brands", brands.join(","));
    }

    if(sort){
      params = params.append("sort", sort);
    }

    params = params.append("pageSize", 20);

    return this.http.get<Pagination<Product>>(this.baseUrl + "products", {params});
  }

  getTypes() {
    if(this.types.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + "products/types").subscribe({
      next: response => this.types = response
    })
  }

  getBrands() {
    if(this.brands.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + "products/brands").subscribe({
      next: response => this.brands = response
    })
  }
}
