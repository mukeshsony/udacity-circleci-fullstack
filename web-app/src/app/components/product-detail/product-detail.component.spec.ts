import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Product } from '../../models/product.model';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 29.99,
    url: 'https://example.com/product.jpg',
    description: 'Test description',
    category: 'Test Category'
  };

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProductById']);
    mockCartService = jasmine.createSpyObj('CartService', ['addToCart']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showInfo',
      'showError'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockProductService.getProductById.and.returnValue(of([mockProduct]));

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CartService, useValue: mockCartService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on init', () => {
    fixture.detectChanges();
    expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
    expect(component.product).toEqual(mockProduct);
  });

  it('should initialize quantity to 1', () => {
    expect(component.quantity).toBe(1);
  });

  it('should add product to cart', () => {
    component.product = mockProduct;
    component.quantity = 3;
    component.addToCart();
    
    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProduct, 3);
  });

  it('should not add to cart if quantity is less than 1', () => {
    component.product = mockProduct;
    component.quantity = 0;
    component.addToCart();
    
    expect(mockCartService.addToCart).not.toHaveBeenCalled();
  });

  it('should navigate back to product list', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display product information', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('h1')?.textContent).toContain('Test Product');
    expect(compiled.querySelector('.product-price')?.textContent).toContain('29.99');
    expect(compiled.querySelector('.product-description')?.textContent).toContain('Test description');
  });
});
