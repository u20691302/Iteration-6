import { Skills } from "../skills/skills.model";
import { Ratings } from "./ratings.model";
import { UserSkill } from "./userSkill.model";

export interface User {
    user_ID: number;
    username: string;
    surname: string;
    email: string;
    idPassport: string;
    cellphone: string;
    role: string;
    rating_ID: number;
    ratings?: Ratings;
    userSkill?: UserSkill[];
    password: string;
    profileImage:string;
    idImage: string;
    skills?: Skills[];
}