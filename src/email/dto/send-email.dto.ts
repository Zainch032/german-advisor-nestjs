import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ example: 'student@example.com', description: 'Recipient email address' })
  @IsEmail()
  to: string;

  @ApiProperty({ example: 'Your German University Shortlist', description: 'Email subject line' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example: 'Here is your personalized list of universities based on your CGPA and IELTS score...',
    description: 'The email body content (plain text or simple HTML)',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
