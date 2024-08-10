import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPromptComponent } from './find-prompt.component';

describe('FindPromptComponent', () => {
  let component: FindPromptComponent;
  let fixture: ComponentFixture<FindPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindPromptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
