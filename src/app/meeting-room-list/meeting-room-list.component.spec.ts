import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingRoomListComponent } from './meeting-room-list.component';

describe('MeetingRoomListComponent', () => {
  let component: MeetingRoomListComponent;
  let fixture: ComponentFixture<MeetingRoomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingRoomListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetingRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
