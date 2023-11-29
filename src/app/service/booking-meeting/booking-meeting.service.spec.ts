import { TestBed } from '@angular/core/testing';

import { BookingMeetingService } from './booking-meeting.service';

describe('BookingMeetingService', () => {
  let service: BookingMeetingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingMeetingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
