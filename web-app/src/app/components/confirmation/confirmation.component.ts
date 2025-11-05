import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit {
  orderData: any;
  fullName: string = '';
  total: number = 0;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {
    // Try to get order data from navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;
    
    // Try multiple sources for order data
    this.orderData = state?.['order'] || history.state?.['order'];
    
    // If still no data, try sessionStorage
    if (!this.orderData) {
      const storedData = sessionStorage.getItem('orderData');
      if (storedData) {
        this.orderData = JSON.parse(storedData);
      }
    }
  }

  ngOnInit(): void {
    if (!this.orderData) {
      // No order data found, redirect to home
      this.router.navigate(['/']);
      return;
    }

    this.fullName = this.orderData.fullName;
    this.total = this.orderData.total;
    
    // Clear the cart after successful order
    this.cartService.clearCart();
    
    // Clear the stored order data after successful confirmation
    sessionStorage.removeItem('orderData');
  }
}
