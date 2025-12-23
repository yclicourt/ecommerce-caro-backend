import { OmitType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CreateUserDto } from 'src/features/users/dto/create-user.dto';
import { Role } from '../common/enums/role.enum';

export class CreateAuthAdminDto extends OmitType(CreateUserDto, ['avatar']) {
  @IsEnum(Role, { each: true })
  role: Role[];
}
