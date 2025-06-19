export interface Empleado {
    idEmpleado: number;
    codigoEmpleado: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: Date;
    fechaInicioContrato: Date;
    idPuesto: number;
    puesto?: {
        nombrePuesto: string;
    };
} 