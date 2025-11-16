import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueCandidaturesComponent } from './historique-candidatures.component';

describe('HistoriqueCandidaturesComponent', () => {
  let component: HistoriqueCandidaturesComponent;
  let fixture: ComponentFixture<HistoriqueCandidaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueCandidaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueCandidaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
