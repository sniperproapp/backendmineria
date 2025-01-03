export class CreateUserDto{


    name:string;
    lastname:string;
    email:string;
    phone:string;
    password:string;
    image?:string;
    id_wallet:string;
    notification_token:string;
    time_limit:Date;
}