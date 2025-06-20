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
  predecesora?: string;
  estado?: string;
  progreso?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private apiUrl = 'http://localhost:5234/api/Tareas/ObtenerTareas';

  constructor(private http: HttpClient) { }

  getTareas(): Observable<TareaDTO[]> {
    return this.http.post<TareaDTO[]>(this.apiUrl, {});
  }
} 