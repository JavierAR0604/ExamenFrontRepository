import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../interfaces/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = 'http://localhost:5234/api/Empleados';

  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<Empleado[]> {
    return this.http.post<Empleado[]>(`${this.apiUrl}/ObtenerEmpleados`, {});
  }

  getEmpleadoPorId(id: number): Observable<Empleado> {
    return this.http.post<Empleado>(`${this.apiUrl}/ObtenerEmpleadoPorId/${id}`, {});
  }

  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(`${this.apiUrl}/CrearEmpleado`, empleado);
  }

  actualizarEmpleado(id: number, empleado: Empleado): Observable<any> {
    return this.http.post(`${this.apiUrl}/ActualizarEmpleado/${id}`, empleado);
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/EliminarEmpleado/${id}`, {});
  }
} 