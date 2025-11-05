import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductItemComponent } from './product-item.component';
import { Product } from '../../models/product.model';

describe('ProductItemComponent', () => {
  let component: ProductItemComponent;
  let fixture: ComponentFixture<ProductItemComponent>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 29.99,
    url: 'test.jpg',
    description: 'Test description',
    category: 'Test'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductItemComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Test Product');
    expect(compiled.querySelector('.product-price')?.textContent).toContain('29.99');
  });

  it('should emit productClicked event when clicked', () => {
    spyOn(component.productClicked, 'emit');
    component.onProductClick();
    expect(component.productClicked.emit).toHaveBeenCalledWith(1);
  });
});
