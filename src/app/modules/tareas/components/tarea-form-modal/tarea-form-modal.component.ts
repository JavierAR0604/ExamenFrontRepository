import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Resource } from '../../pages/tareas-page/tareas-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarea-form-modal',
  standalone: true,
  templateUrl: './tarea-form-modal.component.html',
  styleUrls: ['./tarea-form-modal.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class TareaFormModalComponent {
  @Output() eliminarTarea = new EventEmitter<void>();
  tareaForm: FormGroup;
  estadoVisual: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TareaFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tareaForm = this.fb.group({
      nombreTarea: [data?.title || data?.nombreTarea || '', Validators.required],
      fechaInicio: [data?.start ? new Date(data.start) : data?.fechaInicio ? new Date(data.fechaInicio) : '', Validators.required],
      fechaFin: [data?.end ? new Date(data.end) : data?.fechaFin ? new Date(data.fechaFin) : '', Validators.required],
      idRecurso: [data?.resourceId ?? data?.idRecurso ?? null, Validators.required],
      progreso: [data?.progress ?? data?.progreso ?? 0],
      predecesora: [data?.predecesora ?? null],
      estado: [data?.estado ?? ''],
      idPadre: [data?.parentId ?? data?.idPadre ?? null]
    });
    // Calcular el estado visual
    const progreso = this.tareaForm.get('progreso')?.value ?? 0;
    this.estadoVisual = data?.estado || this.getEstadoFromProgreso(progreso);
  }

  getEstadoFromProgreso(progreso: number): string {
    if (progreso === 0 || progreso === undefined) return 'Asignado';
    if (progreso > 0 && progreso < 100) return 'En progreso';
    if (progreso === 100) return 'Completada';
    return '';
  }

  guardar() {
    if (this.tareaForm.valid) {
      this.dialogRef.close(this.tareaForm.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  eliminar() {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.dialogRef.close({ eliminar: true });
    }
  }
} 