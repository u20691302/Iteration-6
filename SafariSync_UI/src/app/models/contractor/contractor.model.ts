import { ContractorType } from "./contractorType.model";

export interface Contractor {
    contractor_ID: number;
    contractor_Name: string;
    contractor_Phone_Number: string;
    contractor_Email_Address: string;
    contractor_Address: string;
    contractorType_ID: number;
    contractorType?: ContractorType;
  }