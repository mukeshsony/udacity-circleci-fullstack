import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChanged = new EventEmitter<{productId: number, quantity: number}>();
  @Output() removeClicked = new EventEmitter<number>();

  quantityError: string = '';
  localQuantity: number = 0;

  ngOnInit(): void {
    this.localQuantity = this.item.quantity;
  }

  // ngModelChange event handler for real-time validation
  onQuantityModelChange(newQuantity: number): void {
    // Validate quantity as user types
    this.validateQuantity(newQuantity);
    
    // Only emit if valid
    if (!this.quantityError && newQuantity > 0) {
      this.quantityChanged.emit({
        productId: this.item.product.id,
        quantity: newQuantity
      });
    }
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

  onRemove(): void {
    this.removeClicked.emit(this.item.product.id);
  }
}
