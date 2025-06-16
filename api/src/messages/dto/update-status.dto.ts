import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnumMessageStatus } from 'src/common/enums/messageStatus.enum';

export class UpdateStatusDTO {
  @IsEnum(EnumMessageStatus)
  @IsNotEmpty()
  status: EnumMessageStatus;
}