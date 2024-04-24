export class RefProjectType {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
}

export class RefNationalityType {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
}

export class RefInactiveReasonType {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
}

export class RefEmployeeCompanyType {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
}

export class RefCompanyType {
    id?: number;
    companyName?: string;
    location?: string;
    servicesProvided?: string;
    contactPerson: string;
    contactNo: string;
    contactEmail: string;
    remarks?: string;
    createdBy?: string;
    createdAt?: Date;
    modifyBy?: string;
    modifyAt?: Date;
}

export class RefServiceType {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
}

export class RefCampType {
    id?: number;
    campName?: string;
    location?: string;
    remarks?: string;
    createdBy?: string;
    createdAt?: Date;
    modifyBy?: string;
    modifyAt?: Date;
    company?: {id: number};
}

export class RefCateringType {
    id?: number;
    cateringName?: string;
    location?: string;
    messCategory?: string;
    mealType?: string;
    menuType?: string;
    rate?: number;
    upgradedRate?: number;
    remarks?: string;
    createdBy?: string;
    createdAt?: Date;
    modifyBy?: string;
    modifyAt?: Date;
}


