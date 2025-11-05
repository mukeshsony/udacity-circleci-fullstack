import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockCartItems: CartItem[] = [
    {
      product: {
        id: 1,
        name: 'Product 1',
        price: 29.99,
        url: 'test.jpg',
        description: 'Test'
      },
      quantity: 2
    }
  ];

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['getCart', 'getTotal']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], { url: '/checkout' });

    mockCartService.getCart.and.returnValue(of(mockCartItems));
    mockCartService.getTotal.and.returnValue(59.98);

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, ReactiveFormsModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.checkoutForm.value).toEqual({
      fullName: '',
      address: '',
      creditCard: '',
      email: ''
    });
  });

  it('should load cart items on init', () => {
    fixture.detectChanges();
    expect(mockCartService.getCart).toHaveBeenCalled();
    expect(component.cartItems).toEqual(mockCartItems);
    expect(component.total).toBe(59.98);
  });

  it('should redirect to cart if no items', () => {
    mockCartService.getCart.and.returnValue(of([]));
    mockRouter.navigate.calls.reset();
    Object.defineProperty(mockRouter, 'url', { value: '/checkout', writable: true });
    
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/cart']);
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.checkoutForm.valid).toBeFalsy();
    });

    it('should validate fullName - required', () => {
      const control = component.checkoutForm.get('fullName');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('required')).toBeTruthy();
    });

    it('should validate fullName - minLength', () => {
      const control = component.checkoutForm.get('fullName');
      control?.setValue('AB');
      expect(control?.hasError('minlength')).toBeTruthy();
      
      control?.setValue('ABC');
      expect(control?.hasError('minlength')).toBeFalsy();
    });

    it('should validate address - required and minLength', () => {
      const control = component.checkoutForm.get('address');
      expect(control?.hasError('required')).toBeTruthy();
      
      control?.setValue('12345');
      expect(control?.hasError('minlength')).toBeTruthy();
      
      control?.setValue('123456');
      expect(control?.hasError('minlength')).toBeFalsy();
    });

    it('should validate email format', () => {
      const control = component.checkoutForm.get('email');
      control?.setValue('invalid');
      expect(control?.hasError('email')).toBeTruthy();
      
      control?.setValue('test@example.com');
      expect(control?.hasError('email')).toBeFalsy();
    });

    it('should validate creditCard - 16 digits', () => {
      const control = component.checkoutForm.get('creditCard');
      control?.setValue('123');
      expect(control?.hasError('pattern')).toBeTruthy();
      
      control?.setValue('1234567890123456');
      expect(control?.hasError('pattern')).toBeFalsy();
    });

    it('should be valid with all fields filled correctly', () => {
      component.checkoutForm.setValue({
        fullName: 'John Doe',
        address: '123 Main Street',
        email: 'john@example.com',
        creditCard: '1234567890123456'
      });
      
      expect(component.checkoutForm.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.checkoutForm.setValue({
        fullName: 'John Doe',
        address: '123 Main Street',
        email: 'john@example.com',
        creditCard: '1234567890123456'
      });
    });

    it('should submit form and navigate to confirmation', () => {
      component.phoneNumber = '1234567890';
      component.onSubmit();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/confirmation'], 
        jasmine.objectContaining({
          state: jasmine.objectContaining({
            order: jasmine.objectContaining({
              fullName: 'John Doe',
              address: '123 Main Street',
              email: 'john@example.com',
              creditCard: '1234567890123456',
              phoneNumber: '1234567890',
              items: mockCartItems,
              total: 59.98
            })
          })
        })
      );
    });

    it('should not submit if form is invalid', () => {
      component.checkoutForm.get('fullName')?.setValue('');
      component.onSubmit();
      
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  it('should display order summary', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.order-summary')).toBeTruthy();
    expect(compiled.querySelector('.total-amount')?.textContent).toContain('59.98');
  });

  it('should disable submit button when form is invalid', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitButton.disabled).toBeTruthy();
  });
});
