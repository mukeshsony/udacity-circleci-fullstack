import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;
  let mockProduct: Product;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    
    mockProduct = {
      id: 1,
      name: 'Test Product',
      price: 29.99,
      url: 'https://example.com/image.jpg',
      description: 'Test description',
      category: 'Test Category'
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addToCart', () => {
    it('should add a new product to cart', (done) => {
      service.addToCart(mockProduct, 2);
      
      service.getCart().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].product.id).toBe(1);
        expect(items[0].quantity).toBe(2);
        done();
      });
    });

    it('should increase quantity if product already exists in cart', (done) => {
      service.addToCart(mockProduct, 1);
      service.addToCart(mockProduct, 2);
      
      service.getCart().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].quantity).toBe(3);
        done();
      });
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from cart', (done) => {
      service.addToCart(mockProduct, 1);
      service.removeFromCart(1);
      
      service.getCart().subscribe(items => {
        expect(items.length).toBe(0);
        done();
      });
    });
  });

  describe('updateQuantity', () => {
    it('should update product quantity in cart', (done) => {
      service.addToCart(mockProduct, 1);
      service.updateQuantity(1, 5);
      
      service.getCart().subscribe(items => {
        expect(items[0].quantity).toBe(5);
        done();
      });
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', (done) => {
      service.addToCart(mockProduct, 1);
      service.clearCart();
      
      service.getCart().subscribe(items => {
        expect(items.length).toBe(0);
        done();
      });
    });
  });

  describe('getTotal', () => {
    it('should return 0 for empty cart', () => {
      expect(service.getTotal()).toBe(0);
    });

    it('should calculate total correctly for single item', () => {
      service.addToCart(mockProduct, 2);
      expect(service.getTotal()).toBe(59.98);
    });

    it('should calculate total correctly for multiple items', () => {
      const product2: Product = {
        id: 2,
        name: 'Product 2',
        price: 10.00,
        url: 'test.jpg',
        description: 'Test'
      };
      
      service.addToCart(mockProduct, 2);
      service.addToCart(product2, 3);
      expect(service.getTotal()).toBeCloseTo(89.98, 2);
    });
  });

  describe('getItemCount', () => {
    it('should return 0 for empty cart', () => {
      expect(service.getItemCount()).toBe(0);
    });

    it('should return correct count for single item', () => {
      service.addToCart(mockProduct, 3);
      expect(service.getItemCount()).toBe(3);
    });

    it('should return correct count for multiple items', () => {
      const product2: Product = {
        id: 2,
        name: 'Product 2',
        price: 10.00,
        url: 'test.jpg',
        description: 'Test'
      };
      
      service.addToCart(mockProduct, 2);
      service.addToCart(product2, 3);
      expect(service.getItemCount()).toBe(5);
    });
  });
});
