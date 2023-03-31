import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsCountController } from './reactions-count.controller';
import { ReactionsCountService } from './reactions-count.service';

describe('ReactionsCountController', () => {
  let controller: ReactionsCountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactionsCountController],
      providers: [ReactionsCountService],
    }).compile();

    controller = module.get<ReactionsCountController>(ReactionsCountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
