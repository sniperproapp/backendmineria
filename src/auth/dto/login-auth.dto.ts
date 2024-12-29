import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto{

 
email: string;

@IsNotEmpty()
@IsString()
password:string;

tokenpass:string

token:string

}