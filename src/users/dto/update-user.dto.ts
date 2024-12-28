import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto{
 
    name?: string;

    
    lastname?: string;

     
    phone?: string;
    password?: string;
    
    notification_token?: string;
    imagen?: string;
}