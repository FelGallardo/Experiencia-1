import { TestBed } from '@angular/core/testing';

import { ServicesdatosService } from './servicesdatos.service';

describe('ServicesdatosService', () => {
  let service: ServicesdatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesdatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
