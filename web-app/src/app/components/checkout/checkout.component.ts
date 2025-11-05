import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  total: number = 0;
  
  // Template-driven form fields with ngModelChange
  phoneNumber: string = '';
  phoneError: string = '';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(6)]],
      creditCard: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
      
      // Only redirect if cart is empty AND we're still on checkout page
      if (items.length === 0 && this.router.url === '/checkout') {
        this.router.navigate(['/cart']);
      }
    });
  }

  // ngModelChange event handler for real-time phone validation
  onPhoneNumberChange(value: string): void {
    this.validatePhoneNumber(value);
  }

  validatePhoneNumber(phone: string): void {
    if (!phone) {
      this.phoneError = '';
    } else if (phone.length < 10) {
      this.phoneError = 'Phone number must be at least 10 digits';
    } else if (!/^\d+$/.test(phone)) {
      this.phoneError = 'Phone number must contain only digits';
    } else if (phone.length > 15) {
      this.phoneError = 'Phone number cannot exceed 15 digits';
    } else {
      this.phoneError = '';
    }
  }

  onSubmit(): void {
    // Validate phone number before submission
    this.validatePhoneNumber(this.phoneNumber);
    
    if (this.checkoutForm.valid && !this.phoneError) {
      const orderData = {
        ...this.checkoutForm.value,
        phoneNumber: this.phoneNumber,
        items: [...this.cartItems], // Create a copy of cart items
        total: this.total
      };
      
      // Store order data in sessionStorage as backup
      sessionStorage.setItem('orderData', JSON.stringify(orderData));
      
      // Navigate to confirmation with order data
      this.router.navigate(['/confirmation'], { 
        state: { order: orderData }
      });
    }
  }

  get fullName() { return this.checkoutForm.get('fullName'); }
  get address() { return this.checkoutForm.get('address'); }
  get creditCard() { return this.checkoutForm.get('creditCard'); }
  get email() { return this.checkoutForm.get('email'); }
}
