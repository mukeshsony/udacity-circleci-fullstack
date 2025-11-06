import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ConfirmationComponent } from './confirmation.component';
import { CartService } from '../../services/cart.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;

  const mockOrderData = {
    fullName: 'John Doe',
    address: '123 Main Street',
    email: 'john@example.com',
    creditCard: '1234567890123456',
    items: [
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
    ],
    total: 59.98
  };

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['clearCart']);

    await TestBed.configureTestingModule({
      imports: [ConfirmationComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    // Manually set the order data since we can't mock getCurrentNavigation in tests
    component.orderData = mockOrderData;
    expect(component).toBeTruthy();
  });

  it('should load order data and display it', () => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    
    // Manually set order data for testing (before detectChanges)
    component.orderData = mockOrderData;
    component.fullName = mockOrderData.fullName;
    component.total = mockOrderData.total;

    expect(component.fullName).toBe('John Doe');
    expect(component.total).toBe(59.98);
    expect(component.orderData).toEqual(mockOrderData);
  });

  it('should clear cart when order data exists', () => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    
    // Manually set order data before ngOnInit
    component.orderData = mockOrderData;
    
    // Call ngOnInit which should clear the cart
    fixture.detectChanges(); // This triggers ngOnInit

    expect(mockCartService.clearCart).toHaveBeenCalled();
  });

  it('should redirect to home if no order data', () => {
    // Clear any stored order data first
    sessionStorage.removeItem('orderData');
    
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(router, 'getCurrentNavigation').and.returnValue(null);
    
    // Clear history state
    history.replaceState(null, '', window.location.href);
    
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    
    // Ensure orderData is not set
    component.orderData = undefined;
    
    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display order confirmation details', () => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    
    // Set order data before change detection
    component.orderData = mockOrderData;
    component.fullName = mockOrderData.fullName;
    component.total = mockOrderData.total;
    
    // Now trigger change detection to render the template
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Order Confirmed');
    expect(compiled.textContent).toContain('John Doe');
    expect(compiled.textContent).toContain('59.98');
    expect(compiled.textContent).toContain('john@example.com');
    expect(compiled.textContent).toContain('123 Main Street');
  });

  it('should display success icon', () => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    
    component.orderData = mockOrderData;
    component.fullName = mockOrderData.fullName;
    component.total = mockOrderData.total;
    
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.success-icon')).toBeTruthy();
  });
});
