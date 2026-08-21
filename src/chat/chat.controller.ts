import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('chat')
@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({
    summary: 'Send a message to the AI admission advisor',
    description:
      'Forwards the message to the n8n AI Agent workflow (EduRoute) and returns the generated reply.',
  })
  @ApiResponse({ status: 201, description: 'AI reply returned successfully.' })
  @ApiResponse({ status: 502, description: 'Upstream n8n workflow error.' })
  async sendMessage(@Body() dto: SendMessageDto) {
    const reply = await this.chatService.sendMessage(dto.message, dto.sessionId);
    return { reply };
  }
}
