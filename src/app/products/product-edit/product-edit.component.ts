import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Laptop, LaptopCreation } from '../products.models';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, RouterLink],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductsEditComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
 
  @Input({transform: numberAttribute})
  id!: number;

  laptop?: Laptop;

  productsService = inject(ProductsService);
  router = inject(Router);

  form = this.formBuilder.group({
    name: [''],
  });

   ngOnInit(): void {
    this.productsService.getById(this.id).subscribe({
      next: (laptop) => {
        this.laptop = laptop;
        this.form.patchValue(laptop);
        console.log('Loaded laptop:', laptop);
      },
      error: (error) => {
        console.error('Error loading laptop:', error);
        alert('Failed to load laptop data');
      }
    });
  }

  saveChanges(){
    const laptop = this.form.value as LaptopCreation;
    console.log('Saving laptop:', laptop);
    this.productsService.update(this.id, laptop).subscribe({
      next: () => {
        console.log('Update successful');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error updating laptop:', error);
        alert('Failed to update laptop. Please try again.');
      }
    });
  }

}