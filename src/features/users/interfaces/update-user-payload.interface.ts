import { UpdateUserDto } from '../dto/update-user.dto';

export type UpdateUserPayload = UpdateUserDto & {
  avatar?: string;
};