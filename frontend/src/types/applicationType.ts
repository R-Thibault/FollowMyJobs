import { StatusType } from "./statusType";

export type ApplicationType = {
  ID: number;
  Status: StatusType;
  Title: string;
  Url?: string;
  Company: string;
  Location?: string;
  Salary?: number;
  Description?: string;
};

export interface ApplicationDisplayProps {
  applications: ApplicationType[];
}
