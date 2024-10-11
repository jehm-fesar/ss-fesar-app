import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SscpComponent } from './sscp.component';

describe('SscpComponent', () => {
  let component: SscpComponent;
  let fixture: ComponentFixture<SscpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SscpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SscpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
