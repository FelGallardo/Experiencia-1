import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OlvidacontraPage } from './olvidacontra.page';

describe('OlvidacontraPage', () => {
  let component: OlvidacontraPage;
  let fixture: ComponentFixture<OlvidacontraPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OlvidacontraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
