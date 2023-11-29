import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface PeriodicElement {
  name: string;
  id: number;
  capacity: number;
  amenities: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, name: 'Room 1', capacity: 10, amenities: 'Projector, Whiteboard'},
  {id: 2, name: 'Room 2', capacity: 4, amenities: 'TV, Whiteboard'},
  {id: 3, name: 'Room 3', capacity: 6, amenities: 'Stationary, Projector'},
  {id: 4, name: 'Room 4', capacity: 9, amenities: 'Comfortable Seating'},
  {id: 5, name: 'Room 5', capacity: 10, amenities: 'High-Speed, Reliable Internet'},
];

@Component({
  selector: 'app-meeting-room-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSidenavModule, MatListModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './meeting-room-list.component.html',
  styleUrl: './meeting-room-list.component.scss'
})
export class MeetingRoomListComponent implements OnInit{
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      searchtext: [''],
    })
  }

  ngOnInit(): void {
    
  }

  showFiller = true;
  title = "Meeting Room List"

  displayedColumns: string[] = ['id', 'name', 'capacity', 'amenities'];
  dataSource = ELEMENT_DATA;

  filterMeetingRoom() {
    const searchText = this.filterForm.get('searchtext')?.value;
    if(searchText) {
      const filterData = ELEMENT_DATA.filter(value => (value.capacity == searchText || value.amenities.indexOf(searchText) !== -1));
      this.dataSource = [...filterData]
      return;
    }

    this.dataSource = [ ...ELEMENT_DATA];
  }

  clearFilter() {
    this.filterForm.patchValue({searchtext: ''})
    this.dataSource = [ ...ELEMENT_DATA];
  }
  
}
