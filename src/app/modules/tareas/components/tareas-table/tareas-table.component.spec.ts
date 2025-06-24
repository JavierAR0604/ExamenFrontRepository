import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasTableComponent } from './tareas-table.component';

describe('TareasTableComponent', () => {
  let component: TareasTableComponent;
  let fixture: ComponentFixture<TareasTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TareasTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
