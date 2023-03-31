import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './games/games.module';
import { UsersModule } from './users/users.module';
import { ReactionModule } from './reaction/reaction.module';
import { ReactionsCountModule } from './reactions-count/reactions-count.module';
import { AttendeeModule } from './attendee/attendee.module';

@Module({
  imports: [
    GamesModule,
    UsersModule,
    ReactionModule,
    ReactionsCountModule,
    AttendeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
