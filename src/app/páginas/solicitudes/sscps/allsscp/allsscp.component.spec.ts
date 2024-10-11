import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllsscpComponent } from './allsscp.component';

describe('AllsscpComponent', () => {
  let component: AllsscpComponent;
  let fixture: ComponentFixture<AllsscpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllsscpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllsscpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
