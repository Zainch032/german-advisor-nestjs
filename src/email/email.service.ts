import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as Sentry from '@sentry/node';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromAddress: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    // Resend's test/sandbox sender - swap for your verified domain later
    this.fromAddress = this.configService.get<string>('RESEND_FROM') || 'onboarding@resend.dev';
  }

  async sendEmail(to: string, subject: string, content: string) {
    try {
      const result = await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject,
        html: `<div style="font-family: sans-serif; line-height: 1.6;">${content.replace(/\n/g, '<br>')}</div>`,
      });

      this.logger.log(`Email sent to ${to}: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      Sentry.captureException(err);
      this.logger.error('Failed to send email', err.stack);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
