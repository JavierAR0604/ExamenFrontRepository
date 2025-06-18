import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SearchBarComponent } from '../../../shared/search-bar/search-bar.component';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { TopbarComponent } from '../../../shared/topbar/topbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-empleados',
  imports:[SearchBarComponent, TopbarComponent, SidebarComponent, FooterComponent, CommonModule, MatPaginatorModule, MatTableModule ],
  templateUrl: './empleados-page.component.html',
  styleUrls: ['./empleados-page.component.css'],
})
export class EmpleadosPageComponent implements AfterViewInit {
  empleados = [
    { nombre: 'Francisco Javier Alvarado Rios', fechaNacimiento: '06/04/2003', fechaContrato: '06/04/2023', puesto: 'Desarrollador' },
    { nombre: 'Edgar Leal Planes', fechaNacimiento: '06/04/2003', fechaContrato: '06/04/2023', puesto: 'Desarrollador' },
    { nombre: 'Juan Ortiz Contratos', fechaNacimiento: '06/04/2003', fechaContrato: '06/04/2023', puesto: 'Desarrollador' },
    { nombre: 'Lydia Martinez Acuerdos', fechaNacimiento: '06/04/2003', fechaContrato: '06/04/2023', puesto: 'RH' },
    { nombre: 'Jorge Chavez Políticas', fechaNacimiento: '06/04/2003', fechaContrato: '06/04/2023', puesto: 'Patron' },
    { nombre: 'Jorge Calvo', fechaNacimiento: '06/04/2003', fechaContrato: '06/04/2023', puesto: 'Patron' },
    { nombre: 'Pedro paco', fechaNacimiento: '06/04/2003', fechaContrato: '06/04/2023', puesto: 'Patron' },
    // más empleados...
  ];

  displayedColumns: string[] = ['no', 'nombre', 'fechaNacimiento', 'fechaContrato', 'puesto', 'acciones'];

  dataSource = new MatTableDataSource(this.empleados);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  editarEmpleado(empleado: any) {
    console.log('Editar:', empleado);
  }

  eliminarEmpleado(empleado: any) {
    console.log('Eliminar:', empleado);
  }

  verEmpleado(empleado: any) {
  console.log('Ver:', empleado);
  // Aquí podrías abrir un modal o mostrar detalles
}
}