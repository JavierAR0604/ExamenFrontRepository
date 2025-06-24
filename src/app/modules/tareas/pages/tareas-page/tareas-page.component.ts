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
import { TareasTableComponent, Tarea } from '../../components/tareas-table/tareas-table.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog.service';

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
  imports: [
    DxGanttModule, 
    SidebarComponent, 
    TopbarComponent, 
    FooterComponent, 
    SearchBarComponent,
    TareasTableComponent,
    CommonModule
  ],
  templateUrl: './tareas-page.component.html',
  styleUrls: ['./tareas-page.component.css']
})
export class TareasPageComponent implements OnInit {
  tasks: Task[] = [];
  dependencies: Dependency[] = [];
  resources: Resource[] = [];
  resourceAssignments: ResourceAssignment[] = [];
  
  // Variables para búsqueda y tabla
  searchText: string = '';
  tareasFiltradas: Tarea[] = [];
  tareasCompletas: TareaDTO[] = [];

  constructor(
    private tareasService: TareasService,
    private empleadosService: EmpleadosService,
    private dialog: MatDialog,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.cargarTareas();
    this.cargarRecursos();
  }

  cargarTareas() {
    this.tareasService.getTareas().subscribe({
      next: (tareas: TareaDTO[]) => {
        this.tareasCompletas = tareas;
        
        // Mapear para Gantt
        this.tasks = tareas.map(t => ({
          id: t.idTarea,
          parentId: t.idPadre ?? 0,
          title: t.nombreTarea,
          start: t.fechaInicio ? new Date(t.fechaInicio) : undefined,
          end: t.fechaFin ? new Date(t.fechaFin) : undefined,
          progress: t.progreso ?? 0,
          resourceId: t.idRecurso
        }));
        
        // Mapear para tabla
        this.tareasFiltradas = tareas.map(t => {
          const tareaPadre = t.idPadre ? tareas.find(ta => ta.idTarea === t.idPadre) : null;
          const predecesoraObj = t.predecesora ? tareas.find(ta => ta.idTarea === t.predecesora) : null;
          
          return {
            id: t.idTarea,
            nombreTarea: t.nombreTarea,
            fechaInicio: t.fechaInicio ? new Date(t.fechaInicio) : new Date(),
            fechaFin: t.fechaFin ? new Date(t.fechaFin) : new Date(),
            progreso: t.progreso ?? 0,
            idRecurso: t.idRecurso,
            idPadre: t.idPadre,
            predecesora: t.predecesora,
            recurso: t.idRecurso && this.resources.find(r => r.id === t.idRecurso) ? {
              id: t.idRecurso,
              nombre: this.resources.find(r => r.id === t.idRecurso)?.text || ''
            } : undefined,
            tareaPadre: tareaPadre ? {
              id: tareaPadre.idTarea,
              nombreTarea: tareaPadre.nombreTarea
            } : undefined,
            predecesoraObj: predecesoraObj ? {
              id: predecesoraObj.idTarea,
              nombreTarea: predecesoraObj.nombreTarea
            } : undefined
          };
        });
        
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

  // Métodos para búsqueda
  onSearchChange(searchText: string) {
    this.searchText = searchText;
    this.filtrarTareas();
  }

  onClearSearch() {
    this.searchText = '';
    this.tareasFiltradas = this.tareasCompletas.map(t => {
      const tareaPadre = t.idPadre ? this.tareasCompletas.find(ta => ta.idTarea === t.idPadre) : null;
      const predecesoraObj = t.predecesora ? this.tareasCompletas.find(ta => ta.idTarea === t.predecesora) : null;
      
      return {
        id: t.idTarea,
        nombreTarea: t.nombreTarea,
        fechaInicio: t.fechaInicio ? new Date(t.fechaInicio) : new Date(),
        fechaFin: t.fechaFin ? new Date(t.fechaFin) : new Date(),
        progreso: t.progreso ?? 0,
        idRecurso: t.idRecurso,
        idPadre: t.idPadre,
        predecesora: t.predecesora,
        recurso: t.idRecurso && this.resources.find(r => r.id === t.idRecurso) ? {
          id: t.idRecurso,
          nombre: this.resources.find(r => r.id === t.idRecurso)?.text || ''
        } : undefined,
        tareaPadre: tareaPadre ? {
          id: tareaPadre.idTarea,
          nombreTarea: tareaPadre.nombreTarea
        } : undefined,
        predecesoraObj: predecesoraObj ? {
          id: predecesoraObj.idTarea,
          nombreTarea: predecesoraObj.nombreTarea
        } : undefined
      };
    });
  }

  filtrarTareas() {
    if (!this.searchText || this.searchText.trim() === '') {
      this.onClearSearch();
      return;
    }

    const searchTerm = this.searchText.toLowerCase().trim();
    
    this.tareasFiltradas = this.tareasCompletas
      .filter(tarea => {
        // Búsqueda por nombre de tarea
        if (tarea.nombreTarea.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Búsqueda por ID
        if (tarea.idTarea.toString().includes(searchTerm)) {
          return true;
        }
        
        // Búsqueda por recurso
        const recurso = this.resources.find(r => r.id === tarea.idRecurso);
        if (recurso && recurso.text.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Búsqueda por estado
        const estado = this.getEstadoText(tarea.progreso ?? 0);
        if (estado.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Búsqueda por fechas
        if (tarea.fechaInicio) {
          const fechaInicio = new Date(tarea.fechaInicio).toLocaleDateString('es-ES');
          if (fechaInicio.includes(searchTerm)) {
            return true;
          }
        }
        
        if (tarea.fechaFin) {
          const fechaFin = new Date(tarea.fechaFin).toLocaleDateString('es-ES');
          if (fechaFin.includes(searchTerm)) {
            return true;
          }
        }
        
        return false;
      })
      .map(t => {
        const tareaPadre = t.idPadre ? this.tareasCompletas.find(ta => ta.idTarea === t.idPadre) : null;
        const predecesoraObj = t.predecesora ? this.tareasCompletas.find(ta => ta.idTarea === t.predecesora) : null;
        
        return {
          id: t.idTarea,
          nombreTarea: t.nombreTarea,
          fechaInicio: t.fechaInicio ? new Date(t.fechaInicio) : new Date(),
          fechaFin: t.fechaFin ? new Date(t.fechaFin) : new Date(),
          progreso: t.progreso ?? 0,
          idRecurso: t.idRecurso,
          idPadre: t.idPadre,
          predecesora: t.predecesora,
          recurso: t.idRecurso && this.resources.find(r => r.id === t.idRecurso) ? {
            id: t.idRecurso,
            nombre: this.resources.find(r => r.id === t.idRecurso)?.text || ''
          } : undefined,
          tareaPadre: tareaPadre ? {
            id: tareaPadre.idTarea,
            nombreTarea: tareaPadre.nombreTarea
          } : undefined,
          predecesoraObj: predecesoraObj ? {
            id: predecesoraObj.idTarea,
            nombreTarea: predecesoraObj.nombreTarea
          } : undefined
        };
      });
  }

  getEstadoText(progreso: number): string {
    if (progreso === 0) return 'Asignado';
    if (progreso < 100) return 'En progreso';
    return 'Completada';
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
        this.tareasService.eliminarTarea(taskId).subscribe({
          next: () => this.cargarTareas(),
          error: (err) => {
            // Manejar error específico de eliminación
            if (err.status === 500) {
              const tarea = this.tasks.find(t => t.id === taskId);
              const nombreTarea = tarea?.title || 'esta tarea';
              this.confirmDialogService.showErrorEliminacion(
                'tarea', 
                nombreTarea, 
                'es predecesora de otra tarea o tiene dependencias asociadas'
              ).subscribe();
            }
          }
        });
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
    this.tareasService.eliminarTarea(e.key).subscribe({
      next: () => this.cargarTareas(),
      error: (err) => {
        e.cancel = true;
        // Manejar error específico de eliminación
        if (err.status === 500) {
          const tarea = this.tasks.find(t => t.id === e.key);
          const nombreTarea = tarea?.title || 'esta tarea';
          this.confirmDialogService.showErrorEliminacion(
            'tarea', 
            nombreTarea, 
            'es predecesora de otra tarea o tiene dependencias asociadas'
          ).subscribe();
        }
      }
    });
    e.cancel = true;
  }
}

