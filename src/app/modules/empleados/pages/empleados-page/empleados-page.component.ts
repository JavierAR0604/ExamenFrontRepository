import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmpleadosService } from '../../services/empleados.service';
import { Empleado } from '../../interfaces/empleado';
import { SidebarComponent } from "../../../shared/sidebar/sidebar.component";
import { TopbarComponent } from "../../../shared/topbar/topbar.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from "../../../shared/search-bar/search-bar.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmpleadoFormComponent } from '../../components/empleado-form/empleado-form.component';
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-empleados-page',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    CommonModule,
    SearchBarComponent,
    MatDialogModule
  ],
  templateUrl: './empleados-page.component.html',
  styleUrl: './empleados-page.component.css',
})
export class EmpleadosPageComponent implements OnInit, AfterViewInit {
  empleados: Empleado[] = [];
  displayedColumns: string[] = ['idEmpleado', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'fechaInicioContrato', 'nombrePuesto', 'acciones'];
  dataSource = new MatTableDataSource<Empleado>(this.empleados);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empleadosService: EmpleadosService, 
    private dialog: MatDialog,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.empleadosService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.dataSource = new MatTableDataSource(this.empleados);
        this.dataSource.paginator = this.paginator;
        this.configurarFiltro();
      },
      error: (err) => {
        console.error('Error al obtener empleados', err);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  configurarFiltro() {
    this.dataSource.filterPredicate = (data: Empleado, filter: string) => {
      const searchTerm = filter.toLowerCase().trim();
      
      // Si el término de búsqueda está vacío, mostrar todos
      if (!searchTerm) return true;
      
      // Búsqueda por ID (número)
      if (data.idEmpleado.toString().includes(searchTerm)) {
        return true;
      }
      
      // Búsqueda por código de empleado
      if (data.codigoEmpleado.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Búsqueda por nombre
      if (data.nombre.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Búsqueda por apellido paterno
      if (data.apellidoPaterno.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Búsqueda por apellido materno
      if (data.apellidoMaterno && data.apellidoMaterno.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Búsqueda por nombre del puesto
      if (data.puesto?.nombrePuesto && data.puesto.nombrePuesto.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Búsqueda por fecha de nacimiento (formato dd/MM/yyyy)
      const fechaNac = new Date(data.fechaNacimiento);
      const fechaNacStr = fechaNac.toLocaleDateString('es-ES');
      if (fechaNacStr.includes(searchTerm)) {
        return true;
      }
      
      // Búsqueda por fecha de inicio de contrato (formato dd/MM/yyyy)
      const fechaInicio = new Date(data.fechaInicioContrato);
      const fechaInicioStr = fechaInicio.toLocaleDateString('es-ES');
      if (fechaInicioStr.includes(searchTerm)) {
        return true;
      }
      
      return false;
    };
  }

  onSearchChange(searchText: string) {
    this.dataSource.filter = searchText;
  }

  onAddClick() {
    const dialogRef = this.dialog.open(EmpleadoFormComponent, {
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'guardado') {
        this.cargarEmpleados();
      }
    });
  }

  onClearSearch() {
    this.dataSource.filter = '';
  }

  editarEmpleado(empleado: Empleado) {
    const dialogRef = this.dialog.open(EmpleadoFormComponent, {
      data: { empleado }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'guardado') {
        this.cargarEmpleados();
      }
    });
  }

  eliminarEmpleado(empleado: Empleado) {
    const nombreCompleto = `${empleado.nombre} ${empleado.apellidoPaterno}`;
    this.confirmDialogService.confirmDeleteEmpleado(nombreCompleto).subscribe(confirmed => {
      if (confirmed) {
        this.empleadosService.eliminarEmpleado(empleado.idEmpleado).subscribe({
          next: () => {
            this.cargarEmpleados(); // Recargar la lista después de eliminar
          },
          error: (err) => {
            // Manejar error específico de eliminación
            if (err.status === 400) {
              let errorMessage = '';
              if (typeof err.error === 'string') {
                errorMessage = err.error;
              } else if (err.error && typeof err.error === 'object') {
                errorMessage = err.error.message || err.error.error || JSON.stringify(err.error);
              } else {
                errorMessage = 'No se puede eliminar el empleado';
              }
              this.confirmDialogService.showErrorEliminacion('empleado', nombreCompleto, errorMessage).subscribe();
            } else {
              // Error genérico
              console.error('Error al eliminar empleado', err);
              this.confirmDialogService.showErrorEliminacion('empleado', nombreCompleto, 'ocurrió un error inesperado').subscribe();
            }
          }
        });
      }
    });
  }

  verEmpleado(empleado: Empleado) {
    console.log('Ver empleado:', empleado);
    // Aquí irá la lógica para ver detalles del empleado
  }
}