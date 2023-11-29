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
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

export interface PeriodicElement {
  title: string;
  id: number;
  description: string;
  room: string;
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
  imports: [DatePipe, CommonModule, ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, OwlDateTimeModule, OwlNativeDateTimeModule, MatButtonModule, MatDialogModule, MatIconModule ],
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
      room: ['', Validators.required],
      timeFrom: ['', Validators.required],
      timeTo: ['', Validators.required],
      attendees: ['', Validators.required]
    })
  }

  /**
   * open detail popup
   * @param action
   */
  openDialog(action?: string, row?:any) {
    const dialogRef = this.dialog.open(DialogBookingFormDialog, {
      width: '500px',
      data: {
        action,
        row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result) this.openConfirmDialog(result);
    });
  }

  openConfirmDialog(result: any) {
    const dialogConfirmRef = this.dialog.open(DialogConfirmationBookingMeetingDialog, {
      width: '500px',
      data: result
    });
    
    dialogConfirmRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        let existingRecordIndex = this.bookingMeetingService.bookingMeetingList.findIndex(x => x.id === result.id);
        if(existingRecordIndex !== -1) {
          this.bookingMeetingService.bookingMeetingList[existingRecordIndex] = result;
        } else {
          this.bookingMeetingService.bookingMeetingList.push(result);
        }        
        this.dataSource = [ ...this.bookingMeetingService.bookingMeetingList];
        localStorage.setItem('BookingList', JSON.stringify(this.dataSource))
      }
    });
  }

  ngOnInit(): void {
    const localBooking = localStorage.getItem('BookingList');
    if (localBooking) {
      this.bookingMeetingService.bookingMeetingList = JSON.parse(localBooking);
      this.dataSource = [  ...this.bookingMeetingService.bookingMeetingList]
    }
  }

  title = "Book Meeting List"
  displayedColumns: string[] = ['id', 'title', 'description', 'room',  'startdate', 'enddate', 'attendees', 'actions']; 
  dataSource = ELEMENT_DATA;

  /**
   * perform view or edit
   * @param action 
   */
  performAction(action: string, row: any) :void {
    this.openDialog(action, row);
  }
  
}

@Component({
  selector: './dialog-booking-form-dialog',
  templateUrl: './dialog-booking-form-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, OwlDateTimeModule, OwlNativeDateTimeModule, MatButtonModule],
})

export class DialogBookingFormDialog implements OnInit{
  bookingForm: FormGroup;
  min: Date =  new Date();
  startDate: Date =  new Date()

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogBookingFormDialog>,
    public bookingMeetingService: BookingMeetingService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.bookingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      room: ['', Validators.required],
      timeFrom: ['', Validators.required],
      timeTo: ['', Validators.required],
      attendees: ['', Validators.required]
    });

    this.bookingForm.get('timeFrom')?.valueChanges.subscribe({
      next: (value) => {
        this.startDate = value;
      }
    })
  }

  ngOnInit(): void {
    if(this.data?.action === 'view') {
      this.bookingForm.get('title')?.disable();
      this.bookingForm.get('description')?.disable();
      this.bookingForm.get('room')?.disable();
      this.bookingForm.get('timeFrom')?.disable();
      this.bookingForm.get('timeTo')?.disable();
      this.bookingForm.get('attendees')?.disable();
    }
    if(this.data?.row) {
      this.bookingForm.patchValue({
        title: this.data.row.title,
        description: this.data.row.description,
        room: this.data.row.room,
        timeFrom: this.data.row.startdate,
        timeTo: this.data.row.enddate,
        attendees: this.data.row.attendees
      });
    }
  }

  createMeeting() {
    let dataparams: any;
    if(this.data.action === 'new') {
      const idx = Math.floor(Math.random() * 9000 + 1000);
      dataparams = {
        id: idx,
        title: this.bookingForm.get('title')?.value,
        description: this.bookingForm.get('description')?.value,
        room: this.bookingForm.get('room')?.value,
        startdate: this.bookingForm.get('timeFrom')?.value,
        enddate: this.bookingForm.get('timeTo')?.value,
        attendees: this.bookingForm.get('attendees')?.value,
      }
    } else {
      dataparams = {
        id: this.data.row.id,
        title: this.bookingForm.get('title')?.value,
        description: this.bookingForm.get('description')?.value,
        room: this.bookingForm.get('room')?.value,
        startdate: this.bookingForm.get('timeFrom')?.value,
        enddate: this.bookingForm.get('timeTo')?.value,
        attendees: this.bookingForm.get('attendees')?.value
      }
    }
    let selectedMeetingRoom = [];
    selectedMeetingRoom = this.bookingMeetingService.bookingMeetingList.filter(x => x.room === dataparams.room);
    if (this.data.action === 'edit') {
      selectedMeetingRoom.splice(selectedMeetingRoom.findIndex(x => x.id === dataparams.id), 1)
    }
    let conflict = false;
    for(let i = 0; i < selectedMeetingRoom.length; i++) {
      let element = selectedMeetingRoom[i];
      if(!(dataparams.startdate > new Date(element.enddate)) || (dataparams.enddate < new Date(element.startdate))) {
        this.openSnackBar()
        conflict = true;
        break;
      }
    }
    if(conflict) {
      return;
    }
    this.dialogRef.close(dataparams);
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  openSnackBar() {
    this._snackBar.open('Booking is already exist in selected time slot.', 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5000,
    });
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
    if (params == 'OK') {
      this.dialogConfirmRef.close(this.data);
    }
  }
  dismissConfirmationDialog() {
    this.dialogConfirmRef.close()
  }
  
}
