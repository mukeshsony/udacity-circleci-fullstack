import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CartItemComponent } from './cart-item.component';
import { CartItem } from '../../models/cart-item.model';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  const mockCartItem: CartItem = {
    product: {
      id: 1,
      name: 'Test Product',
      price: 29.99,
      url: 'test.jpg',
      description: 'Test description'
    },
    quantity: 2
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    component.item = mockCartItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize localQuantity from item', () => {
    expect(component.localQuantity).toBe(2);
  });

  it('should display product information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Test Product');
    expect(compiled.querySelector('.item-price')?.textContent).toContain('29.99');
  });

  it('should emit quantityChanged event when valid', () => {
    spyOn(component.quantityChanged, 'emit');
    component.onQuantityModelChange(5);
    
    expect(component.quantityChanged.emit).toHaveBeenCalledWith({
      productId: 1,
      quantity: 5
    });
  });

  it('should emit removeClicked event', () => {
    spyOn(component.removeClicked, 'emit');
    component.onRemove();
    expect(component.removeClicked.emit).toHaveBeenCalledWith(1);
  });

  it('should validate quantity', () => {
    component.validateQuantity(0);
    expect(component.quantityError).toBeTruthy();
    
    component.validateQuantity(5);
    expect(component.quantityError).toBeFalsy();
  });

  it('should not emit quantityChanged when invalid', () => {
    spyOn(component.quantityChanged, 'emit');
    component.onQuantityModelChange(0);
    
    expect(component.quantityChanged.emit).not.toHaveBeenCalled();
  });
});
