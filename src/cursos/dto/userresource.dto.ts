import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class userresource{

 
 
    name: string;
    num_review:number
    lastname: string;
    avg_rating:number
    n_students:number
    count_course:number
    notification_token?: string;
    imagen: string;
 
}