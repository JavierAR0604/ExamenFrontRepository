import { Component, OnInit } from '@angular/core';
import { TareasService, TareaDTO } from '../../services/tareas.service';
import { DxGanttModule } from 'devextreme-angular';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { TopbarComponent } from '../../../shared/topbar/topbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

// Interfaces para el Gantt
export interface Task {
  id: number;
  parentId?: number;
  title: string;
  start?: Date;
  end?: Date;
  progress?: number;
}
export interface Dependency {
  id: number;
  predecessorId: number;
  successorId: number;
  type: number;
}
export interface Resource {
  id: number;
  text: string;
}
export interface ResourceAssignment {
  id: number;
  taskId: number;
  resourceId: number;
}

@Component({
  selector: 'demo-app',
  imports: [DxGanttModule, SidebarComponent, TopbarComponent, FooterComponent,],
  templateUrl: './tareas-page.component.html',
  styleUrls: ['./tareas-page.component.css']
})
export class TareasPageComponent implements OnInit {
  tasks: Task[] = [];
  dependencies: Dependency[] = [];
  resources: Resource[] = [];
  resourceAssignments: ResourceAssignment[] = [];

  constructor(private tareasService: TareasService) {}

  ngOnInit(): void {
    this.tareasService.getTareas().subscribe({
      next: (tareas: TareaDTO[]) => {
        // Mapear tareas
        this.tasks = tareas.map(t => ({
          id: t.idTarea,
          parentId: t.idPadre ?? 0,
          title: t.nombreTarea,
          start: t.fechaInicio ? new Date(t.fechaInicio) : undefined,
          end: t.fechaFin ? new Date(t.fechaFin) : undefined,
          progress: t.progreso ?? 0
        }));

        // Mapear dependencias
        this.dependencies = tareas
          .filter(t => t.predecesora && !isNaN(Number(t.predecesora)))
          .map((t, idx) => ({
            id: idx + 1,
            predecessorId: Number(t.predecesora),
            successorId: t.idTarea,
            type: 0 // fin-inicio estándar
          }));

        // Mapear recursos únicos
        const recursoMap = new Map<number, Resource>();
        tareas.forEach(t => {
          if (t.idRecurso && t.recursoNombre) {
            recursoMap.set(t.idRecurso, { id: t.idRecurso, text: t.recursoNombre });
          }
        });
        this.resources = Array.from(recursoMap.values());

        // Mapear asignaciones de recursos
        this.resourceAssignments = tareas
          .filter(t => t.idRecurso)
          .map((t, idx) => ({
            id: idx + 1,
            taskId: t.idTarea,
            resourceId: t.idRecurso!
          }));
      },
      error: err => {
        console.error('Error al obtener tareas', err);
      }
    });
  }
}

