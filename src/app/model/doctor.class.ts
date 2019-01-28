import { WorkingHour } from "./working-hour.class";
import { Subspecialty } from "./subspecialty.class";

export class Doctor {
    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public phoneNumber: string;
    public subspecialties: Array<Subspecialty>;
    public consultationLength: number;
    public workingHours: Array<WorkingHour>;
    public active: boolean;
}