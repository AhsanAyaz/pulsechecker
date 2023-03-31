import { Test, TestingModule } from '@nestjs/testing';
import { AttendeeController } from './attendee.controller';
import { AttendeeService } from './attendee.service';

describe('AttendeeController', () => {
  let controller: AttendeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendeeController],
      providers: [AttendeeService],
    }).compile();

    controller = module.get<AttendeeController>(AttendeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
