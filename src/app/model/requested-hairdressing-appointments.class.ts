import { AppointmentsPerHour } from "./appointments-per-hour.class";

export class RequestedHairdressingAppointments {
    public professionalId: number;
    public professionalFirstName: string;
    public professionalLastName: string;
    public requestedAppointmentsPerHour: Array<AppointmentsPerHour>;
}