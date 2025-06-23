import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TareaDTO {
  idTarea: number;
  nombreTarea: string;
  fechaInicioPlan?: string;
  fechaFinPlan?: string;
  fechaInicio?: string;
  fechaFin?: string;
  idRecurso?: number;
  recursoNombre?: string;
  idPadre?: number;
  predecesora?: number;
  estado?: string;
  progreso?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private baseUrl = 'http://localhost:5234/api/Tareas';

  constructor(private http: HttpClient) { }

  getTareas(): Observable<TareaDTO[]> {
    return this.http.post<TareaDTO[]>(`${this.baseUrl}/ObtenerTareas`, {});
  }

  crearTarea(tarea: Partial<TareaDTO>): Observable<TareaDTO> {
    return this.http.post<TareaDTO>(`${this.baseUrl}/CrearTarea`, tarea);
  }

  actualizarTarea(id: number, tarea: Partial<TareaDTO>): Observable<any> {
    return this.http.post(`${this.baseUrl}/ActualizarTarea/${id}`, tarea);
  }

  eliminarTarea(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/eliminar/${id}`, {});
  }
} 