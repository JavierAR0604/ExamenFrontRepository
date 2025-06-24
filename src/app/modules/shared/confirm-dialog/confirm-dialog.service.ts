import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialog: MatDialog) { }

  /**
   * Muestra un diálogo de confirmación genérico
   */
  confirm(data: ConfirmDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data,
      width: '450px',
      disableClose: true,
      panelClass: 'confirm-dialog-container'
    });

    return dialogRef.afterClosed();
  }

  /**
   * Confirmación para cerrar sesión
   */
  confirmLogout(): Observable<boolean> {
    return this.confirm({
      title: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres salir de la sesión?',
      confirmText: 'Sí, Cerrar Sesión',
      cancelText: 'Cancelar',
      type: 'warning'
    });
  }

  /**
   * Confirmación para eliminar empleado
   */
  confirmDeleteEmpleado(nombre: string): Observable<boolean> {
    return this.confirm({
      title: 'Eliminar Empleado',
      message: `¿Estás seguro de que quieres eliminar al empleado "${nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
  }

  /**
   * Confirmación para eliminar puesto
   */
  confirmDeletePuesto(nombre: string): Observable<boolean> {
    return this.confirm({
      title: 'Eliminar Puesto',
      message: `¿Estás seguro de que quieres eliminar el puesto "${nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
  }

  /**
   * Confirmación para eliminar tarea
   */
  confirmDeleteTarea(nombre: string): Observable<boolean> {
    return this.confirm({
      title: 'Eliminar Tarea',
      message: `¿Estás seguro de que quieres eliminar la tarea "${nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
  }

  /**
   * Muestra un mensaje de error de eliminación
   */
  showErrorEliminacion(tipo: 'tarea' | 'empleado' | 'puesto', nombre: string, razon: string): Observable<boolean> {
    return this.confirm({
      title: `No se puede eliminar ${tipo}`,
      message: `No se puede eliminar ${tipo} "${nombre}" porque ${razon}.`,
      confirmText: 'Entendido',
      cancelText: '',
      type: 'warning'
    });
  }

  /**
   * Muestra un mensaje de error específico para puestos con empleados vinculados
   */
  showErrorPuestoConEmpleados(nombre: string, empleadosCount: number): Observable<boolean> {
    return this.confirm({
      title: 'No se puede eliminar puesto',
      message: `No se puede eliminar el puesto "${nombre}" porque tiene ${empleadosCount} empleado(s) vinculado(s). Primero debe reasignar o eliminar estos empleados.`,
      confirmText: 'Entendido',
      cancelText: '',
      type: 'warning'
    });
  }
} 