import { IsNotEmpty, IsString, isNotEmpty, isString } from "class-validator";

export class CreateRolDto{

    @IsNotEmpty()
    @IsString()
    id: string;


    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    imagen: string;


    @IsNotEmpty()
    @IsString()
    rute: string;

}