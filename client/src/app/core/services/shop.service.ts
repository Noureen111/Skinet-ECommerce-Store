import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/Pagination';
import { Product } from '../../shared/models/Product';
import { ShopParams } from '../../shared/models/ShopParams';

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
  

  getProducts(shopParams: ShopParams) {

    debugger
    let params = new HttpParams();
    if(shopParams.types.length > 0) {
      params = params.append("types", shopParams.types.join(","));
    }

    if(shopParams.brands.length > 0) {
      params = params.append("brands", shopParams.brands.join(","));
    }

    if(shopParams.sort) {
      params = params.append("sort", shopParams.sort);
    }

    if(shopParams.search) {
      params = params.append("search", shopParams.search);
    }

    params = params.append("pageSize", shopParams.pageSize);
    params = params.append("pageIndex", shopParams.pageNumber);

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
