import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EmpleadosService } from '../../services/empleados.service';
import { PuestosService } from '../../../puestos/services/puestos.service';
import { Puesto } from '../../../puestos/interfaces/puesto';
import { Empleado } from '../../interfaces/empleado';
import { CommonModule, NgFor} from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  templateUrl: './empleado-form.component.html',
  styleUrls: ['./empleado-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgFor,
  ]
})
export class EmpleadoFormComponent implements OnInit {
  empleadoForm!: FormGroup;
  puestos: Puesto[] = [];
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmpleadoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { empleado?: Empleado },
    private empleadosService: EmpleadosService,
    private puestosService: PuestosService
  ) {}

  ngOnInit(): void {
    this.empleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: [''],
      fechaNacimiento: ['', Validators.required],
      fechaInicioContrato: ['', Validators.required],
      idPuesto: ['', Validators.required]
    });

    if (this.data?.empleado) {
      this.isEdit = true;
      this.empleadoForm.addControl('codigoEmpleado', this.fb.control({ value: this.data.empleado.codigoEmpleado, disabled: true }));
      this.empleadoForm.patchValue(this.data.empleado);
    }

    this.puestosService.getPuestos().subscribe({
      next: (puestos) => this.puestos = puestos
    });
  }

  guardar() {
    if (this.empleadoForm.invalid) return;
    const empleado: Empleado = this.empleadoForm.getRawValue();

    if (this.isEdit && this.data?.empleado) {
      this.empleadosService.actualizarEmpleado(this.data.empleado.idEmpleado, empleado).subscribe(() => {
        this.dialogRef.close('guardado');
      });
    } else {
      this.empleadosService.crearEmpleado(empleado).subscribe(() => {
        this.dialogRef.close('guardado');
      });
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
} 