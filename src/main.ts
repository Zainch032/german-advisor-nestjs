import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { SentryExceptionFilter } from './common/sentry-exception.filter';

async function bootstrap() {
  // ── Sentry: error tracking & monitoring ──────────────────────────
  // Get your DSN from https://sentry.io -> Create Project -> Node.js
  Sentry.init({
    dsn: process.env.SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });

  const app = await NestFactory.create(AppModule);

  // Report all uncaught exceptions to Sentry before returning the error response
  app.useGlobalFilters(new SentryExceptionFilter());

  // Validate incoming DTOs automatically (rejects bad request bodies)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors();

  // ── Swagger: auto-generated REST API documentation ───────────────
  const config = new DocumentBuilder()
    .setTitle('EduRoute API')
    .setDescription(
      'AI-powered German University Admission Advisor API — chat, eligibility, and email endpoints.',
    )
    .setVersion('1.0')
    .addTag('chat', 'AI chatbot conversation endpoints')
    .addTag('email', 'Email delivery endpoints (via Resend)')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  // Swagger UI will be live at: http://localhost:3000/api-docs

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📘 Swagger docs available at /api-docs`);
}

bootstrap();