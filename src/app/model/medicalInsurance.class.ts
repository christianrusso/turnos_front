import { MedicalPlan } from "./medicalPlan.class";

export class MedicalInsurance {
    public id: number;
    public description: string;
    public medicalPlans: Array<MedicalPlan>;
}