import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PuestosService } from '../../services/puestos.service';
import { Puesto } from '../../interfaces/puesto';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-puesto-form',
  standalone: true,
  templateUrl: './puesto-form.component.html',
  styleUrls: ['./puesto-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class PuestoFormComponent implements OnInit {
  puestoForm!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PuestoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { puesto?: Puesto },
    private puestosService: PuestosService
  ) {}

  ngOnInit(): void {
    this.puestoForm = this.fb.group({
      nombrePuesto: ['', Validators.required]
    });

    if (this.data?.puesto) {
      this.isEdit = true;
      this.puestoForm.patchValue(this.data.puesto);
    }
  }

  guardar() {
    if (this.puestoForm.invalid) return;
    const puesto: Puesto = this.puestoForm.value;

    if (this.isEdit && this.data?.puesto) {
      this.puestosService.actualizarPuesto(this.data.puesto.idPuesto, puesto).subscribe(() => {
        this.dialogRef.close('guardado');
      });
    } else {
      this.puestosService.crearPuesto(puesto).subscribe(() => {
        this.dialogRef.close('guardado');
      });
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
} 