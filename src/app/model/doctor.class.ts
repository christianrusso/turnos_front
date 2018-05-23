import { WorkingHour } from "./working-hour.class";

export class Doctor {
    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public phoneNumber: string;
    public specialtyId: number | null;
    public specialtyDescription: string;
    public subspecialtyId: number;
    public subspecialtyDescription: string;
    public consultationLength: number;
    public workingHours: Array<WorkingHour>;
}