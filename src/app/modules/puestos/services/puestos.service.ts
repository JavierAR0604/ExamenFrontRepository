import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Puesto } from '../interfaces/puesto';

@Injectable({
  providedIn: 'root'
})
export class PuestosService {
  private apiUrl = 'http://localhost:5234/api/Puestos'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  getPuestos(): Observable<Puesto[]> {
    return this.http.post<Puesto[]>(`${this.apiUrl}/ObtenerPuestos`, {});
  }

  getPuestoPorId(id: number): Observable<Puesto> {
    return this.http.post<Puesto>(`${this.apiUrl}/ObtenerPuestoPorId/${id}`, {});
  }

  crearPuesto(puesto: Puesto): Observable<Puesto> {
    return this.http.post<Puesto>(`${this.apiUrl}/CrearPuesto`, puesto);
  }

  actualizarPuesto(id: number, puesto: Puesto): Observable<any> {
    return this.http.post(`${this.apiUrl}/ActualizarPuesto/${id}`, puesto);
  }

  eliminarPuesto(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/EliminarPuesto/${id}`, {});
  }
} 