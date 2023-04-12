import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReactionsCountModule } from './reactions-count/reactions-count.module';
import { AttendeeModule } from './attendee/attendee.module';
import { SessionsModule } from './sessions/session.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    UsersModule,
    ReactionsCountModule,
    AttendeeModule,
    SessionsModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
