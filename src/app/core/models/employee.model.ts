export class Employee {
  id: number;
  image: string;
  badgeNo: string;
  employeeName: string;
  jobTitle: string;
  department: string;
  nationality: string;
  category: string;
  contractBase: string;
  band: string;
  eqvBand: string;
  project: string;
  isCcc: boolean;
  company: string;
  workLocation: string;
  messEntitlment: string;
  mealCategory: string;
  mealType: string;
  religion: string;
  employeeActive: boolean;
  inactiveReason: string;
  mobileNo: string;
  passportNo: string;
  qidNo: string;
  email: string;
  messCard: string;
  milkCard: string;

  constructor(
    id?: number,
    image?: string,
    badgeNo?: string,
    employeeName?: string,
    jobTitle?: string,
    department?: string,
    nationality?: string,
    category?: string,
    contractBase?: string,
    band?: string,
    eqvBand?: string,
    project?: string,
    isCcc: boolean = true,
    company?: string,
    workLocation?: string,
    messEntitlment?: string,
    mealCategory?: string,
    mealType?: string,
    religion?: string,
    employeeActive?: boolean,
    inactiveReason?: string,
    mobileNo?: string,
    passportNo?: string,
    qidNo?: string,
    email?: string,
    messCard?: string,
    milkCard?: string
  ) {
    this.id = id;
    this.image = image;
    this.badgeNo = badgeNo;
    this.employeeName = employeeName;
    this.jobTitle = jobTitle;
    this.department = department;
    this.nationality = nationality;
    this.category = category;
    this.contractBase = contractBase;
    this.band = band;
    this.eqvBand = eqvBand;
    this.project = project;
    this.isCcc = isCcc;
    this.company = company;
    this.workLocation = workLocation;
    this.messEntitlment = messEntitlment;
    this.mealCategory = mealCategory;
    this.mealType = mealType;
    this.religion = religion;
    this.employeeActive = employeeActive;
    this.inactiveReason = inactiveReason;
    this.mobileNo = mobileNo;
    this.passportNo = passportNo;
    this.qidNo = qidNo;
    this.email = email;
    this.messCard = messCard;
    this.milkCard = milkCard;
  }
}
