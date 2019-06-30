import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeSingleComponent } from './maze-single.component';

describe('MazeSingleComponent', () => {
  let component: MazeSingleComponent;
  let fixture: ComponentFixture<MazeSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MazeSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
