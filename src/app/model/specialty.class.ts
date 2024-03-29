import { Subspecialty } from "./subspecialty.class";

export class Specialty {
    public id: number;
    public description: string;
    public doctors: number;
    public subspecialties: Array<Subspecialty>;
}