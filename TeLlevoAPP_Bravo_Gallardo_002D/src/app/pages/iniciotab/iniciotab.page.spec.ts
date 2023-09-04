import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IniciotabPage } from './iniciotab.page';

describe('IniciotabPage', () => {
  let component: IniciotabPage;
  let fixture: ComponentFixture<IniciotabPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IniciotabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
