import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);

  constructor() { }

  getNotification(): Observable<Notification | null> {
    return this.notificationSubject.asObservable();
  }

  showSuccess(message: string): void {
    this.notificationSubject.next({ message, type: 'success' });
    this.autoHide();
  }

  showError(message: string): void {
    this.notificationSubject.next({ message, type: 'error' });
    this.autoHide();
  }

  showInfo(message: string): void {
    this.notificationSubject.next({ message, type: 'info' });
    this.autoHide();
  }

  clear(): void {
    this.notificationSubject.next(null);
  }

  private autoHide(): void {
    setTimeout(() => {
      this.clear();
    }, 3000);
  }
}
