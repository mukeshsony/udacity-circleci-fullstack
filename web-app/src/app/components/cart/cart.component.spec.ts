import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { of } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  const mockCartItems: CartItem[] = [
    {
      product: {
        id: 1,
        name: 'Product 1',
        price: 29.99,
        url: 'https://example.com/product1.jpg',
        description: 'Description 1'
      },
      quantity: 2
    },
    {
      product: {
        id: 2,
        name: 'Product 2',
        price: 49.99,
        url: 'https://example.com/product2.jpg',
        description: 'Description 2'
      },
      quantity: 1
    }
  ];

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', [
      'getCart',
      'updateQuantity',
      'removeFromCart',
      'getTotal'
    ]);
    
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showInfo',
      'showError'
    ]);
    
    mockCartService.getCart.and.returnValue(of(mockCartItems));
    mockCartService.getTotal.and.returnValue(109.97);

    await TestBed.configureTestingModule({
      imports: [CartComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items on init', () => {
    fixture.detectChanges();
    expect(mockCartService.getCart).toHaveBeenCalled();
    expect(component.cartItems.length).toBe(2);
    expect(component.cartItems).toEqual(mockCartItems);
  });

  it('should calculate total on init', () => {
    fixture.detectChanges();
    expect(component.total).toBe(109.97);
  });

  it('should update quantity when changed', () => {
    fixture.detectChanges();
    component.onQuantityChanged({ productId: 1, quantity: 5 });
    expect(mockCartService.updateQuantity).toHaveBeenCalledWith(1, 5);
    expect(mockCartService.getTotal).toHaveBeenCalled();
  });

  it('should remove item from cart', () => {
    fixture.detectChanges();
    component.onItemRemoved(1);
    expect(mockCartService.removeFromCart).toHaveBeenCalledWith(1);
    expect(mockCartService.getTotal).toHaveBeenCalled();
  });

  it('should display cart items', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cartItems = compiled.querySelectorAll('.cart-item');
    expect(cartItems.length).toBe(2);
  });

  it('should display empty cart message when no items', () => {
    mockCartService.getCart.and.returnValue(of([]));
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-cart')).toBeTruthy();
    expect(compiled.textContent).toContain('Your cart is empty');
  });

  it('should display total', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.summary-value')?.textContent).toContain('109.97');
  });
});
