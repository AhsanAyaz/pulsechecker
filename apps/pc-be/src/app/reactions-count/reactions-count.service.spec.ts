import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsCountService } from './reactions-count.service';

describe('ReactionsCountService', () => {
  let service: ReactionsCountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionsCountService],
    }).compile();

    service = module.get<ReactionsCountService>(ReactionsCountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
