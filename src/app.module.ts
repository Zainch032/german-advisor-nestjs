import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { EmailModule } from './email/email.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env automatically
    ChatModule,
    EmailModule,
  ],
 
})
export class AppModule {}