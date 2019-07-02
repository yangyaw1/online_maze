import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMazeComponent } from './new-maze.component';

describe('NewMazeComponent', () => {
  let component: NewMazeComponent;
  let fixture: ComponentFixture<NewMazeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMazeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMazeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
