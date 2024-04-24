export class AdvancedBooking {
    id?: number;
    bookingStartDate: Date;
    bookingEndDate: Date;
    remarks?: string;
    createdBy?: string;
    createdAt?: Date;
    modifyBy?: string;
    modifyAt?: Date;
    roomDetails?: number;
  
    constructor(
      id?: number,
      bookingStartDate?: Date,
      bookingEndDate?: Date,
      remarks?: string,
      createdBy?: string,
      createdAt?: Date,
      modifyBy?: string,
      modifyAt?: Date,
      roomDetails?: number
    ) {
      this.id = id;
      this.bookingStartDate = bookingStartDate;
      this.bookingEndDate = bookingEndDate;
      this.remarks = remarks;
      this.createdBy = createdBy;
      this.createdAt = createdAt;
      this.modifyBy = modifyBy;
      this.modifyAt = modifyAt;
      this.roomDetails = roomDetails;
    }
  }
  