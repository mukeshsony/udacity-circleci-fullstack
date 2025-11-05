import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { Product } from '../../models/product.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      price: 29.99,
      url: 'https://example.com/product1.jpg',
      description: 'Description 1',
      category: 'Category 1'
    },
    {
      id: 2,
      name: 'Product 2',
      price: 49.99,
      url: 'https://example.com/product2.jpg',
      description: 'Description 2',
      category: 'Category 2'
    }
  ];

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);
    mockProductService.getProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, RouterTestingModule]
    })
    .overrideProvider(ProductService, { useValue: mockProductService })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    fixture.detectChanges();
    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.products).toEqual(mockProducts);
  });

  it('should display products in template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const productCards = compiled.querySelectorAll('.product-card');
    expect(productCards.length).toBe(2);
  });

  it('should display product names', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const productNames = compiled.querySelectorAll('.product-card h3');
    expect(productNames[0].textContent).toContain('Product 1');
    expect(productNames[1].textContent).toContain('Product 2');
  });

  it('should display product prices', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const productPrices = compiled.querySelectorAll('.product-price');
    expect(productPrices[0].textContent).toContain('29.99');
    expect(productPrices[1].textContent).toContain('49.99');
  });
});
