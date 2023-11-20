import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificaPerfilPage } from './modifica-perfil.page';

describe('ModificaPerfilPage', () => {
  let component: ModificaPerfilPage;
  let fixture: ComponentFixture<ModificaPerfilPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModificaPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
