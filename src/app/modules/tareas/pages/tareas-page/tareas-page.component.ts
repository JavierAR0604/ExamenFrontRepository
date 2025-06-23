import { Component, OnInit } from '@angular/core';
import { TareasService, TareaDTO } from '../../services/tareas.service';
import { DxGanttModule } from 'devextreme-angular';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { TopbarComponent } from '../../../shared/topbar/topbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { EmpleadosService } from '../../../empleados/services/empleados.service';
import { SearchBarComponent } from '../../../shared/search-bar/search-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { TareaFormModalComponent } from '../../components/tarea-form-modal/tarea-form-modal.component';

// Interfaces para el Gantt
export interface Task {
  id: number;
  parentId?: number;
  title: string;
  start?: Date;
  end?: Date;
  progress?: number;
  resourceId?: number;
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
  imports: [DxGanttModule, SidebarComponent, TopbarComponent, FooterComponent, SearchBarComponent],
  templateUrl: './tareas-page.component.html',
  styleUrls: ['./tareas-page.component.css']
})
export class TareasPageComponent implements OnInit {
  tasks: Task[] = [];
  dependencies: Dependency[] = [];
  resources: Resource[] = [];
  resourceAssignments: ResourceAssignment[] = [];

  constructor(
    private tareasService: TareasService,
    private empleadosService: EmpleadosService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarTareas();
    this.cargarRecursos();
  }

  cargarTareas() {
    this.tareasService.getTareas().subscribe({
      next: (tareas: TareaDTO[]) => {
        this.tasks = tareas.map(t => ({
          id: t.idTarea,
          parentId: t.idPadre ?? 0,
          title: t.nombreTarea,
          start: t.fechaInicio ? new Date(t.fechaInicio) : undefined,
          end: t.fechaFin ? new Date(t.fechaFin) : undefined,
          progress: t.progreso ?? 0,
          resourceId: t.idRecurso
        }));
        this.dependencies = tareas
          .filter(t => typeof t.predecesora === 'number' && t.predecesora !== null)
          .map((t, idx) => ({
            id: idx + 1,
            predecessorId: t.predecesora as number,
            successorId: t.idTarea,
            type: 0
          }));
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

  cargarRecursos() {
    this.empleadosService.getEmpleados().subscribe({
      next: (empleados) => {
        this.resources = empleados.map(emp => ({
          id: emp.idEmpleado,
          text: emp.nombre + ' ' + emp.apellidoPaterno
        }));
      },
      error: err => {
        console.error('Error al obtener recursos', err);
      }
    });
  }

  // Abrir modal para nueva tarea
  onAddTarea() {
    const dialogRef = this.dialog.open(TareaFormModalComponent, {
      width: '400px',
      data: { resources: this.resources, tareas: this.tasks }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Armar objeto para backend
        const tarea = {
          nombreTarea: result.nombreTarea,
          fechaInicio: result.fechaInicio ? new Date(result.fechaInicio).toISOString() : undefined,
          fechaFin: result.fechaFin ? new Date(result.fechaFin).toISOString() : undefined,
          fechaInicioPlan: result.fechaInicio ? new Date(result.fechaInicio).toISOString() : undefined,
          fechaFinPlan: result.fechaFin ? new Date(result.fechaFin).toISOString() : undefined,
          idPadre: result.idPadre && result.idPadre !== 0 ? result.idPadre : null,
          idRecurso: result.idRecurso ?? undefined,
          progreso: result.progreso ?? 0,
          predecesora: result.predecesora && result.predecesora !== 0 ? result.predecesora : null,
          estado: result.estado ?? ''
        };
        this.tareasService.crearTarea(tarea).subscribe({
          next: () => this.cargarTareas(),
          error: err => console.error('Error al crear tarea:', err)
        });
      }
    });
  }

  // Abrir modal para editar tarea al hacer click en una tarea del Gantt
  onTaskClick(e: any) {
    const taskId = e.key;
    const tarea = this.tasks.find(t => t.id === taskId);
    if (!tarea) return;
    const dialogRef = this.dialog.open(TareaFormModalComponent, {
      width: '400px',
      data: {
        resources: this.resources,
        tareas: this.tasks.filter(t => t.id !== taskId), // No permitir ser su propio padre
        ...tarea
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.eliminar) {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
          this.tareasService.eliminarTarea(taskId).subscribe({
            next: () => this.cargarTareas(),
            error: err => console.error('Error al eliminar tarea:', err)
          });
        }
        return;
      }
      if (result) {
        const tareaEditada = {
          nombreTarea: result.nombreTarea,
          fechaInicio: result.fechaInicio ? new Date(result.fechaInicio).toISOString() : undefined,
          fechaFin: result.fechaFin ? new Date(result.fechaFin).toISOString() : undefined,
          fechaInicioPlan: result.fechaInicio ? new Date(result.fechaInicio).toISOString() : undefined,
          fechaFinPlan: result.fechaFin ? new Date(result.fechaFin).toISOString() : undefined,
          idPadre: result.idPadre && result.idPadre !== 0 ? result.idPadre : null,
          idRecurso: result.idRecurso ?? undefined,
          progreso: result.progreso ?? 0,
          predecesora: result.predecesora && result.predecesora !== 0 ? result.predecesora : null,
          estado: result.estado ?? ''
        };
        this.tareasService.actualizarTarea(taskId, tareaEditada).subscribe({
          next: () => this.cargarTareas(),
          error: err => console.error('Error al editar tarea:', err)
        });
      }
    });
  }

  // Deshabilitar edición nativa del Gantt
  onTaskInserting(e: any) {
    e.cancel = true;
  }
  onTaskUpdating(e: any) {
    e.cancel = true;
    this.onTaskClick(e);
  }
  onTaskDeleting(e: any) {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.tareasService.eliminarTarea(e.key).subscribe({
        next: () => this.cargarTareas(),
        error: () => { e.cancel = true; }
      });
    }
    e.cancel = true;
  }
}

