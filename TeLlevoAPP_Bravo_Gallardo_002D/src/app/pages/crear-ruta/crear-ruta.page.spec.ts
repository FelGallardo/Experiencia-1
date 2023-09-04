import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearRutaPage } from './crear-ruta.page';

describe('CrearRutaPage', () => {
  let component: CrearRutaPage;
  let fixture: ComponentFixture<CrearRutaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrearRutaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
