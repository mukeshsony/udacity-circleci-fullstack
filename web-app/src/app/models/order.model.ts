import { CartItem } from './cart-item.model';

export interface Order {
  fullName: string;
  address: string;
  creditCard: string;
  items: CartItem[];
  total: number;
}
