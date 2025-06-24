import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PuestosService } from '../../services/puestos.service';
import { Puesto } from '../../interfaces/puesto';
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
import { PuestoFormComponent } from '../../components/puesto-form/puesto-form.component';
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-puestos-page',
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
  templateUrl: './puestos-page.component.html',
  styleUrl: './puestos-page.component.css',
})
export class PuestosPageComponent implements OnInit, AfterViewInit {
  puestos: Puesto[] = [];
  displayedColumns: string[] = ['idPuesto', 'nombrePuesto', 'acciones'];
  dataSource = new MatTableDataSource<Puesto>(this.puestos);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private puestosService: PuestosService, 
    private dialog: MatDialog,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.cargarPuestos();
  }

  cargarPuestos() {
    this.puestosService.getPuestos().subscribe({
      next: (data) => {
        this.puestos = data;
        this.dataSource = new MatTableDataSource(this.puestos);
        this.dataSource.paginator = this.paginator;
        this.configurarFiltro();
      },
      error: (err) => {
        console.error('Error al obtener puestos', err);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  configurarFiltro() {
    this.dataSource.filterPredicate = (data: Puesto, filter: string) => {
      const searchTerm = filter.toLowerCase().trim();
      
      // Si el término de búsqueda está vacío, mostrar todos
      if (!searchTerm) return true;
      
      // Búsqueda por ID (número)
      if (data.idPuesto.toString().includes(searchTerm)) {
        return true;
      }
      
      // Búsqueda por nombre del puesto
      if (data.nombrePuesto.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      return false;
    };
  }

  onSearchChange(searchText: string) {
    this.dataSource.filter = searchText;
  }

  onAddClick() {
    const dialogRef = this.dialog.open(PuestoFormComponent, {
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'guardado') {
        this.cargarPuestos();
      }
    });
  }

  onClearSearch() {
    this.dataSource.filter = '';
  }

  editarPuesto(puesto: Puesto) {
    const dialogRef = this.dialog.open(PuestoFormComponent, {
      data: { puesto }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'guardado') {
        this.cargarPuestos();
      }
    });
  }

  eliminarPuesto(puesto: Puesto) {
    this.confirmDialogService.confirmDeletePuesto(puesto.nombrePuesto).subscribe(confirmed => {
      if (confirmed) {
        this.puestosService.eliminarPuesto(puesto.idPuesto).subscribe({
          next: () => {
            this.cargarPuestos(); // Recargar la lista después de eliminar
          },
          error: (err) => {
            // Manejar error específico de eliminación
            if (err.status === 400) {
              let errorMessage = '';
              
              // Intentar extraer el mensaje de error
              if (typeof err.error === 'string') {
                errorMessage = err.error;
              } else if (err.error && typeof err.error === 'object') {
                errorMessage = err.error.message || err.error.error || JSON.stringify(err.error);
              } else {
                errorMessage = 'No se puede eliminar el puesto';
              }
              
              if (errorMessage.includes('empleado(s) vinculado(s)')) {
                // Extraer el número de empleados del mensaje
                const match = errorMessage.match(/(\d+)\s+empleado\(s\)/);
                const empleadosCount = match ? parseInt(match[1]) : 0;
                
                this.confirmDialogService.showErrorPuestoConEmpleados(puesto.nombrePuesto, empleadosCount).subscribe();
              } else {
                // Otro tipo de error 400
                this.confirmDialogService.showErrorEliminacion('puesto', puesto.nombrePuesto, errorMessage).subscribe();
              }
            } else {
              // Error genérico
              console.error('Error al eliminar puesto', err);
              this.confirmDialogService.showErrorEliminacion('puesto', puesto.nombrePuesto, 'ocurrió un error inesperado').subscribe();
            }
          }
        });
      }
    });
  }

  verPuesto(puesto: Puesto) {
    console.log('Ver puesto:', puesto);
    // Aquí irá la lógica para ver detalles del puesto
  }
}
