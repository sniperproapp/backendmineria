import { SetMetadata } from "@nestjs/common";
import { JwtRole } from "./jwt-Rol";

export const HasRoles=(...roles: JwtRole[])=>SetMetadata('roles',roles);
