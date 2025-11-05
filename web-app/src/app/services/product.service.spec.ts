import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return an Observable<Product[]>', () => {
      service.getProducts().subscribe(products => {
        expect(products.length).toBe(2);
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne('assets/data.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should handle errors gracefully', () => {
      service.getProducts().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('assets/data.json');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getProductById', () => {
    it('should return an Observable<Product[]>', () => {
      service.getProductById(1).subscribe(products => {
        expect(products.length).toBe(2);
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne('assets/data.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });
});
