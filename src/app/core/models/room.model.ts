export class Room {
  id?: number;
  roomDescription: string;
  block: string;
  floor: string;
  roomCategory: string;
  bedCount: number;
  roomNo: string;
  roomAllocation: string;
  roomConfiguration: string;
  availableFrom: Date;
  roomStatus: string;
  bedOnly: boolean;
  monthlyRate: number;
  dailyRate: number;
  bedRate: number;
  reservationRate: number;
  remarks: string;
  createdBy: string;
  createdAt: Date;
  modifyBy: string;
  modifyAt: Date;
  catering: number;
  bedDetails: number;
  roomAdvanceBookings: number;
  bookings: number;
  camp: number;

  constructor(id?: number | undefined,
    roomDescription?: string,
    block?: string,
    floor?: string,
    roomCategory?: string,
    bedCount?: number,
    roomNo?: string,
    roomAllocation?: string,
    roomConfiguration?: string,
    availableFrom?: Date,
    roomStatus?: string,
    bedOnly?: boolean,
    monthlyRate?: number,
    dailyRate?: number,
    bedRate?: number,
    reservationRate?: number,
    remarks?: string,
    createdBy?: string,
    createdAt?: Date,
    modifyBy?: string,
    modifyAt?: Date,
    catering?: number,
    bedDetails?: number,
    roomAdvanceBookings?: number,
    bookings?: number,
    camp?: number
  ) {
    this.roomDescription = roomDescription;
    this.id = id;
    this.block = block;
    this.floor = floor;
    this.roomCategory = roomCategory;
    this.bedCount = bedCount;
    this.roomNo = roomNo;
    this.roomAllocation = roomAllocation;
    this.roomConfiguration = roomConfiguration;
    this.availableFrom = availableFrom;
    this.roomStatus = roomStatus;
    this.bedOnly = bedOnly;
    this.monthlyRate = monthlyRate;
    this.dailyRate = dailyRate;
    this.bedRate = bedRate;
    this.reservationRate = reservationRate;
    this.remarks = remarks;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.modifyBy = modifyBy;
    this.modifyAt = modifyAt;
    this.catering = catering;
    this.bedDetails = bedDetails;
    this.roomAdvanceBookings = roomAdvanceBookings;
    this.bookings = bookings;
    this.camp = camp;
  }
}
