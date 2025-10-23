import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAcceuilComponent } from './sidebar-acceuil.component';

describe('SidebarAcceuilComponent', () => {
  let component: SidebarAcceuilComponent;
  let fixture: ComponentFixture<SidebarAcceuilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarAcceuilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarAcceuilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
