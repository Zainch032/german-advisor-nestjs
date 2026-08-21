import { Injectable, Logger, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly n8nWebhookUrl: string;

  constructor(private configService: ConfigService) {
    // The n8n AI Agent webhook (your existing, working EduRoute workflow).
    // n8n handles the actual OpenAI/Gemini call + tool orchestration.
    this.n8nWebhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL');
  }

  async sendMessage(message: string, sessionId?: string): Promise<string> {
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: message, sessionId }),
      });

      const text = await response.text();

      if (!response.ok) {
        this.logger.error(`n8n error: ${response.status} - ${text}`);
        throw new BadGatewayException(`n8n workflow error: ${response.status}`);
      }

      if (!text) {
        this.logger.warn('n8n returned empty response');
        return 'No response from agent.';
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        this.logger.error('Failed to parse n8n response as JSON', text);
        throw new BadGatewayException('Invalid JSON from workflow');
      }

      // n8n sometimes wraps the response in an array
      const payload = Array.isArray(data) ? data[0] : data;

      return (
        (payload && (payload.output || payload.text || payload.message || payload.response)) ||
        'No response from agent.'
      );
    } catch (err) {
      // Sentry: report the error for monitoring/alerting
      Sentry.captureException(err);
      this.logger.error('Chat service failure', err.stack);
      throw err;
    }
  }
}
