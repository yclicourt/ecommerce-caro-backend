import { CreateAuthAdminDto } from "../dto/create-auth-admin.dto";

export type RegisterUserAdminPayload = CreateAuthAdminDto & {
  avatar?: string;
};