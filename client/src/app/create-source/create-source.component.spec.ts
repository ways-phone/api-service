import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSourceComponent } from './create-source.component';

describe('CreateSourceComponent', () => {
  let component: CreateSourceComponent;
  let fixture: ComponentFixture<CreateSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
