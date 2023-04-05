import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PulseMeterComponent } from './pulse-meter.component';

describe('PulseMeterComponent', () => {
  let component: PulseMeterComponent;
  let fixture: ComponentFixture<PulseMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PulseMeterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PulseMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
