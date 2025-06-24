import { AfterViewInit, Component, Input, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

export interface Tarea {
  id: number;
  nombreTarea: string;
  fechaInicio: Date;
  fechaFin: Date;
  progreso: number;
  idRecurso?: number;
  idPadre?: number;
  predecesora?: number;
  recurso?: {
    id: number;
    nombre: string;
  };
  tareaPadre?: {
    id: number;
    nombreTarea: string;
  };
  predecesoraObj?: {
    id: number;
    nombreTarea: string;
  };
}

@Component({
  selector: 'app-tareas-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    CommonModule
  ],
  templateUrl: './tareas-table.component.html',
  styleUrl: './tareas-table.component.css',
})
export class TareasTableComponent implements OnInit, AfterViewInit {
  @Input() tareas: Tarea[] = [];
  
  displayedColumns: string[] = [
    'id', 
    'nombreTarea', 
    'fechaInicio', 
    'fechaFin', 
    'recurso', 
    'progreso', 
    'estado', 
    'tareaPadre', 
    'predecesora'
  ];
  dataSource = new MatTableDataSource<Tarea>(this.tareas);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.tareas);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    if (this.dataSource) {
      this.dataSource.data = this.tareas;
    }
  }

  getProgresoColor(progreso: number): string {
    if (progreso === 0) return 'warn';
    if (progreso < 100) return 'accent';
    return 'primary';
  }

  getEstadoText(progreso: number): string {
    if (progreso === 0) return 'Asignado';
    if (progreso < 100) return 'En progreso';
    return 'Completada';
  }

  getEstadoClass(progreso: number): string {
    if (progreso === 0) return 'estado-asignado';
    if (progreso < 100) return 'estado-progreso';
    return 'estado-completada';
  }
}
