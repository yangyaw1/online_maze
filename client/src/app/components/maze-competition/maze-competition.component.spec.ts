import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeCompetitionComponent } from './maze-competition.component';

describe('MazeCompetitionComponent', () => {
  let component: MazeCompetitionComponent;
  let fixture: ComponentFixture<MazeCompetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MazeCompetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
