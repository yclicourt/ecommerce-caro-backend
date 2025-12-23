import { CreateAuthDto } from '../dto/create-auth.dto';

export type RegisterUserPayload = CreateAuthDto & {
  avatar?: string;
};
