import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SessionsService } from '../sessions/session.service';
import { CreateSessionDto } from '../sessions/dto/create-session.dto';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private sessionsService: SessionsService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {user}
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return { user }
  }

  @Get(':id/sessions')
  async getUserSessions(@Param('id') id: string) {
    const sessions = await this.sessionsService.getUserSessions(id);
    return sessions
  }

  @Post(':id/sessions')
  async createUserSession(@Param('id') id: string, @Body() session: CreateSessionDto) {
    const createdSession = await this.sessionsService.create(session);
    return createdSession
  }

  @Delete(':id/sessions/:sessionId')
  async deleteUserSession(@Param('id') id: string, @Param('sessionId') sessionId: string) {
    const session = await this.sessionsService.findOne(Number(sessionId));
    if (session.userId !== id) {
      throw new UnauthorizedException('You can only delete your sessions')
    }
    const deletedSession = await this.sessionsService.deleteUserSession(session.id);
    return deletedSession
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
