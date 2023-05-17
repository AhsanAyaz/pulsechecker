import { TestBed } from '@angular/core/testing';

import { TooManyRequestsInterceptor } from './too-many-requests.interceptor';

describe('TooManyRequestsInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TooManyRequestsInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TooManyRequestsInterceptor = TestBed.inject(TooManyRequestsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
