import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearclienteComponent } from './crearcliente.component';

describe('CrearclienteComponent', () => {
  let component: CrearclienteComponent;
  let fixture: ComponentFixture<CrearclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearclienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
