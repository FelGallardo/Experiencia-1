import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscaVehiPage } from './busca-vehi.page';

describe('BuscaVehiPage', () => {
  let component: BuscaVehiPage;
  let fixture: ComponentFixture<BuscaVehiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BuscaVehiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
