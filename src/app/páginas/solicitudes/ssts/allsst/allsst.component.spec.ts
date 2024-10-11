import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllsstComponent } from '../../../solicitudes/ssts/allsst/allsst.component';

describe('AllsstComponent', () => {
  let component: AllsstComponent;
  let fixture: ComponentFixture<AllsstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllsstComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllsstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
