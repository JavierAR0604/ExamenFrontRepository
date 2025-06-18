import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SidebarComponent } from "../../../shared/sidebar/sidebar.component";
import { TopbarComponent } from "../../../shared/topbar/topbar.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from "../../../shared/search-bar/search-bar.component";

@Component({
  selector: 'app-puestos-page',
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, MatPaginatorModule, SidebarComponent, TopbarComponent, FooterComponent, CommonModule, SearchBarComponent],
  templateUrl: './puestos-page.component.html',
  styleUrl: './puestos-page.component.css',
})
export class PuestosPageComponent implements AfterViewInit {
  // Datos de puestos con las propiedades que usas en la tabla
  puestos = [
    { puesto: 'Desarrollador', Descripcion: 'Desarrollo de software y aplicaciones' },
    { puesto: 'RH', Descripcion: 'Recursos Humanos' },
    { puesto: 'Patron', Descripcion: 'Gerente general' },
    { puesto: 'Analista', Descripcion: 'Análisis de datos' },
    { puesto: 'Soporte', Descripcion: 'Soporte técnico' },
    { puesto: 'Desarrollador', Descripcion: 'Soporte técnico' },
    { puesto: 'QA', Descripcion: 'Soporte técnico' },
    // agrega más puestos aquí
  ];

  // Columnas que se muestran en la tabla, incluyendo acciones
  displayedColumns: string[] = ['no', 'puesto', 'descripcion', 'acciones'];

  // Fuente de datos para la tabla material
  dataSource = new MatTableDataSource(this.puestos);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  editarEmpleado(puesto: any) {
    console.log('Editar puesto:', puesto);
    // Lógica para editar puesto
  }

  eliminarEmpleado(puesto: any) {
    console.log('Eliminar puesto:', puesto);
    // Lógica para eliminar puesto
  }

  verEmpleado(puesto: any) {
    console.log('Ver puesto:', puesto);
    // Lógica para mostrar detalles del puesto
  }
}
