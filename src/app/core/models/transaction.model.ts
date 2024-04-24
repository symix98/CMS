export class Transaction {
  id?: number;
  roomId: number;
  badgeNo: string;
  bedNo: string;
  checkInDate: Date;
  checkOutDate: Date;
  guestStatus: string;
  leaveStartDate: Date;
  leaveEndDate: Date;
  docuploaded: boolean;
  employeeMaster: number;
  roomDetails: number;
  remarks: string;

  constructor(
      id?: number,
      roomId?: number,
      badgeNo?: string,
      bedNo?: string,
      checkInDate?: Date,
      checkOutDate?: Date,
      guestStatus?: string,
      leaveStartDate?: Date,
      leaveEndDate?: Date,
      docuploaded?: boolean,
      employeeMaster?: number,
      roomDetails?: number,
      remarks?: string,
  ) {
      this.id = id;
      this.roomId = roomId;
      this.badgeNo = badgeNo;
      this.bedNo = bedNo;
      this.checkInDate = checkInDate;
      this.checkOutDate = checkOutDate;
      this.guestStatus = guestStatus;
      this.leaveStartDate = leaveStartDate;
      this.leaveEndDate = leaveEndDate;
      this.docuploaded = docuploaded;
      this.employeeMaster = employeeMaster;
      this.roomDetails = roomDetails;
      this.remarks = remarks;
  }
}
