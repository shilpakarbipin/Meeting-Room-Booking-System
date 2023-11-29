import { Routes } from '@angular/router';
import { MeetingRoomListComponent } from './meeting-room-list/meeting-room-list.component';
import { BookMeetingComponent } from './book-meeting/book-meeting.component';

export const routes: Routes = [
    { path: 'meeting-rooms', component: MeetingRoomListComponent },
    { path: 'book-meeting', component: BookMeetingComponent },
    { path: '', redirectTo: '/meeting-rooms', pathMatch: 'full' },
];