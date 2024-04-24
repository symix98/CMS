export class BedDetails {
    id?: number;
    bedNo?: string;
    bedStatus?: string;
    remarks?: string;
    roomDetails?: number;
  
    constructor(
      id?: number,
      bedNo?: string,
      bedStatus?: string,
      remarks?: string,
      roomDetails?: number
    ) {
      this.id = id;
      this.bedNo = bedNo;
      this.bedStatus = bedStatus;
      this.remarks = remarks;
      this.roomDetails = roomDetails;
    }
  }
  