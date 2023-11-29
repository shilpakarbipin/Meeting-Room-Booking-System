import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import { BookingMeetingService } from '../service/booking-meeting/booking-meeting.service'

export interface PeriodicElement {
  title: string;
  id: number;
  description: string;
  startdate: string,
  enddate: string,
  attendees: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  // {id: 1, title: 'Stand up', description: 'daily stand up meeting', startdate: '11/28/2023, 8:00 PM', enddate: '11/28/2023, 8:30 PM', attendees: 'person1, person2'},
];

@Component({
  selector: 'app-book-meeting',
  standalone: true,
  imports: [DatePipe, CommonModule, ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, OwlDateTimeModule, OwlNativeDateTimeModule, MatButtonModule, MatDialogModule, MatIconModule ],
  templateUrl: './book-meeting.component.html',
  styleUrl: './book-meeting.component.scss'
})

export class BookMeetingComponent implements OnInit{
  bookingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public bookingMeetingService: BookingMeetingService
  ) {
    this.bookingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      timeFrom: ['', Validators.required],
      timeTo: ['', Validators.required],
      attendees: ['', Validators.required]
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogBookingFormDialog, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.openConfirmDialog(result);
    });
  }

  openConfirmDialog(result: any) {
    const dialogConfirmRef = this.dialog.open(DialogConfirmationBookingMeetingDialog, {
      width: '500px',
      data: result
    });
    
    dialogConfirmRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      debugger
      this.bookingMeetingService.bookingMeetingList.push(result);
      this.dataSource = [ ...this.bookingMeetingService.bookingMeetingList];

      
    });
  }

  ngOnInit(): void {
    
  }

  title = "Book Meeting List"
  displayedColumns: string[] = ['id', 'title', 'description', 'startdate', 'enddate', 'attendees'];
  dataSource = ELEMENT_DATA;
}

@Component({
  selector: './dialog-booking-form-dialog',
  templateUrl: './dialog-booking-form-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, OwlDateTimeModule, OwlNativeDateTimeModule, MatButtonModule],
})

export class DialogBookingFormDialog {
  bookingForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogBookingFormDialog>
  ) {
    this.bookingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      timeFrom: ['', Validators.required],
      timeTo: ['', Validators.required],
      attendees: ['', Validators.required]
    })
  }

  createMeeting() {
    const idx = Math.floor(Math.random() * 9000 + 1000);
    const dataparams = {
      id: idx,
      title: this.bookingForm.get('title')?.value,
      description: this.bookingForm.get('description')?.value,
      startdate: this.bookingForm.get('timeFrom')?.value,
      enddate: this.bookingForm.get('timeTo')?.value,
      attendees: this.bookingForm.get('attendees')?.value,
    }
    this.dialogRef.close(dataparams);
  }
  
}

@Component({
  selector: './dialog-confirmation-booking-meeting-dialog',
  templateUrl: './dialog-confirmation-booking-meeting-dialog.html',
  standalone: true,
  imports: [DatePipe, MatDialogModule, MatButtonModule, ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, OwlDateTimeModule, OwlNativeDateTimeModule, MatButtonModule],
  providers: [DatePipe]
})

export class DialogConfirmationBookingMeetingDialog {

  constructor(
    public dialog: MatDialog,
    public dialogConfirmRef: MatDialogRef<DialogConfirmationBookingMeetingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
      console.log(data);
  }
  
  closeConfirmationDialog(params: string) {
    debugger
    if (params == 'OK') {
      this.dialogConfirmRef.close(this.data);
    }
  }
  
}
