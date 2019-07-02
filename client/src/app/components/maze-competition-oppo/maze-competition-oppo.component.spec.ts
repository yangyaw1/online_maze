import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeCompetitionOppoComponent } from './maze-competition-oppo.component';

describe('MazeCompetitionOppoComponent', () => {
  let component: MazeCompetitionOppoComponent;
  let fixture: ComponentFixture<MazeCompetitionOppoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MazeCompetitionOppoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeCompetitionOppoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
