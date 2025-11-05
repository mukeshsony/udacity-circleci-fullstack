import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  quantity: number = 1;
  quantityError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe(products => {
      this.product = products.find(p => p.id === id);
    });
  }

  // ngModelChange event handler for real-time quantity validation
  onQuantityChange(newQuantity: number): void {
    this.validateQuantity(newQuantity);
  }

  validateQuantity(quantity: number): void {
    if (!quantity || quantity < 1) {
      this.quantityError = 'Quantity must be at least 1';
    } else if (quantity > 99) {
      this.quantityError = 'Quantity cannot exceed 99';
    } else if (!Number.isInteger(quantity)) {
      this.quantityError = 'Quantity must be a whole number';
    } else {
      this.quantityError = '';
    }
  }

  addToCart(): void {
    // Validate before adding
    this.validateQuantity(this.quantity);
    
    if (this.product && this.quantity > 0 && !this.quantityError) {
      this.cartService.addToCart(this.product, this.quantity);
      const message = this.quantity === 1 
        ? `${this.product.name} added to cart` 
        : `${this.quantity} × ${this.product.name} added to cart`;
      this.notificationService.showSuccess(message);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
