import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { CartItemComponent } from '../cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.updateTotal();
    });
  }

  // Parent component handles events from child components
  onQuantityChanged(event: {productId: number, quantity: number}): void {
    const item = this.cartItems.find(i => i.product.id === event.productId);
    const productName = item?.product.name || 'Item';
    
    this.cartService.updateQuantity(event.productId, event.quantity);
    this.updateTotal();
    
    this.notificationService.showInfo(`${productName} quantity updated to ${event.quantity}`);
  }

  onItemRemoved(productId: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    const productName = item?.product.name || 'Item';
    
    this.cartService.removeFromCart(productId);
    this.updateTotal();
    
    this.notificationService.showSuccess(`${productName} removed from cart`);
  }

  updateTotal(): void {
    this.total = this.cartService.getTotal();
  }
}
