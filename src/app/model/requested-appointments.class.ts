import { AppointmentsPerHour } from "./appointments-per-hour.class";

export class RequestedAppointments {
    public doctorId: number;
    public doctorFirstName: string;
    public doctorLastName: string;
    public requestedAppointmentsPerHour: Array<AppointmentsPerHour>;
}