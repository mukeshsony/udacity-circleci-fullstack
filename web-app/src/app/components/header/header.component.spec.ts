import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['getCart', 'getItemCount']);
    mockCartService.getCart.and.returnValue(of([]));
    mockCartService.getItemCount.and.returnValue(0);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cart item count to 0', () => {
    expect(component.cartItemCount).toBe(0);
  });

  it('should subscribe to cart changes on init', () => {
    fixture.detectChanges();
    expect(mockCartService.getCart).toHaveBeenCalled();
    expect(mockCartService.getItemCount).toHaveBeenCalled();
  });

  it('should update cart item count when cart changes', () => {
    mockCartService.getItemCount.and.returnValue(5);
    fixture.detectChanges();
    expect(component.cartItemCount).toBe(5);
  });

  it('should display MyStore logo', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo h1')?.textContent).toContain('MyStore');
  });

  it('should display navigation links', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.nav-link');
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it('should display cart badge when items exist', () => {
    mockCartService.getItemCount.and.returnValue(3);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.cart-badge');
    expect(badge).toBeTruthy();
    expect(badge?.textContent).toContain('3');
  });

  it('should not display cart badge when no items', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.cart-badge');
    expect(badge).toBeFalsy();
  });
});
