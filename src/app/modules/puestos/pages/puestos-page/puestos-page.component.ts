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

  constructor(private puestosService: PuestosService, private dialog: MatDialog) {}

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
    if(confirm('¿Está seguro de eliminar este puesto?')) {
      this.puestosService.eliminarPuesto(puesto.idPuesto).subscribe({
        next: () => {
          this.cargarPuestos(); // Recargar la lista después de eliminar
        },
        error: (err) => {
          console.error('Error al eliminar puesto', err);
        }
      });
    }
  }

  verPuesto(puesto: Puesto) {
    console.log('Ver puesto:', puesto);
    // Aquí irá la lógica para ver detalles del puesto
  }
}
