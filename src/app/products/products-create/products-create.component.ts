import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../products.service';
import { LaptopCreation } from '../products.models';
import { MatInputModule } from '@angular/material/input';
import { ProductsFormComponent } from '../products-form/products-form.component';


@Component({
  selector: 'app-products-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, RouterLink, MatInputModule, ProductsFormComponent],  
  templateUrl: './products-create.component.html',
  styleUrl: './products-create.component.css',
})
export class ProductsCreateComponent {
  private readonly formBuilder = inject(FormBuilder);
  productService = inject(ProductsService);
  router = inject(Router);

  saveChanges(laptop: LaptopCreation) {
    this.productService.create(laptop).subscribe(() => {
    this.router.navigate(['/products']);
    });
  }
}
