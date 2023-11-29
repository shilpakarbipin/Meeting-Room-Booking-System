import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingMeetingService {
  bookingMeetingList: Array<any> = [];
  constructor() { }
}
