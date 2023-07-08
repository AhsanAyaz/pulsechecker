import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaceBackgroundComponent } from './pace-background.component';

describe('PaceBackgroundComponent', () => {
  let component: PaceBackgroundComponent;
  let fixture: ComponentFixture<PaceBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaceBackgroundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaceBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
