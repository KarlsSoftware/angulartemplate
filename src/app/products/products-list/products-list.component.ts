import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../products.service';
import { Laptop } from '../products.models';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {
  productsService = inject(ProductsService);
  laptops?: Laptop[];

  constructor(){
   this.loadProducts();
  }

  loadProducts(){
    this.productsService.getAll().subscribe(laptops => {
      this.laptops = laptops;
    });
  }

  delete(id: number){
    this.productsService.delete(id).subscribe(() => {
      this.loadProducts();
    });
  }

}