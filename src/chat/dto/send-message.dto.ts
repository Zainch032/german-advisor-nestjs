import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    example: 'Which university in Germany is best for Computer Science?',
    description: 'The user message sent to the AI advisor',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: 'user-session-123',
    description: 'A session ID to track conversation memory',
    required: false,
  })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
