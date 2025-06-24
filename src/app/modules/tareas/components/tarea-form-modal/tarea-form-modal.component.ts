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
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog.service';

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.tareaForm = this.fb.group({
      nombreTarea: [data?.title || data?.nombreTarea || '', Validators.required],
      fechaInicio: [data?.start ? new Date(data.start) : data?.fechaInicio ? new Date(data.fechaInicio) : '', Validators.required],
      fechaFin: [data?.end ? new Date(data.end) : data?.fechaFin ? new Date(data.fechaFin) : '', Validators.required],
      idRecurso: [data?.resourceId ?? data?.idRecurso ?? null, Validators.required],
      progreso: [data?.progress ?? data?.progreso ?? 0, [Validators.min(0), Validators.max(100)]],
      predecesora: [data?.predecesora ?? null],
      estado: [data?.estado ?? ''],
      idPadre: [data?.parentId ?? data?.idPadre ?? null]
    });
    
    // Calcular el estado visual inicial
    const progreso = this.tareaForm.get('progreso')?.value ?? 0;
    this.estadoVisual = data?.estado || this.getEstadoFromProgreso(progreso);
    
    // Escuchar cambios en el progreso para actualizar el estado
    this.tareaForm.get('progreso')?.valueChanges.subscribe(valor => {
      this.estadoVisual = this.getEstadoFromProgreso(valor);
    });
  }

  getEstadoFromProgreso(progreso: number): string {
    if (progreso === 0 || progreso === undefined) return 'Asignado';
    if (progreso > 0 && progreso < 100) return 'En progreso';
    if (progreso === 100) return 'Completada';
    return '';
  }

  onProgresoChange(): void {
    const progresoControl = this.tareaForm.get('progreso');
    if (progresoControl) {
      let valor = progresoControl.value;
      
      // Convertir a número si es string
      if (typeof valor === 'string') {
        valor = parseFloat(valor) || 0;
      }
      
      // Limitar el valor entre 0 y 100
      if (valor < 0) {
        valor = 0;
        progresoControl.setValue(0, { emitEvent: false });
      } else if (valor > 100) {
        valor = 100;
        progresoControl.setValue(100, { emitEvent: false });
      }
      
      // Actualizar el estado visual
      this.estadoVisual = this.getEstadoFromProgreso(valor);
    }
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
    const nombreTarea = this.tareaForm.get('nombreTarea')?.value || 'esta tarea';
    this.confirmDialogService.confirmDeleteTarea(nombreTarea).subscribe(confirmed => {
      if (confirmed) {
        this.dialogRef.close({ eliminar: true });
      }
    });
  }
} 