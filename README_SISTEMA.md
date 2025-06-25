# Manual de Usuario: Sistema de Gestión de Empleados, Puestos y Tareas

## Descripción General

Este sistema permite gestionar empleados, puestos de trabajo y tareas dentro de una organización. Está compuesto por un frontend en Angular y un backend en .NET. El acceso está protegido mediante autenticación.

---

## Funcionalidades Principales

### 1. **Inicio de Sesión**
- Los usuarios deben ingresar su correo y contraseña para acceder al sistema.
- Solo los usuarios autorizados pueden acceder a las funcionalidades internas.

### 2. **Gestión de Empleados**
- **Ver empleados:** Muestra una tabla con todos los empleados registrados.
- **Agregar empleado:** Permite registrar un nuevo empleado llenando un formulario con datos personales y laborales.
- **Editar empleado:** Se puede modificar la información de un empleado existente.
- **Eliminar empleado:** Opción para dar de baja a un empleado.

### 3. **Gestión de Puestos**
- **Ver puestos:** Lista todos los puestos de trabajo disponibles.
- **Agregar puesto:** Permite crear un nuevo puesto.
- **Editar puesto:** Modifica la información de un puesto existente.
- **Eliminar puesto:** Elimina un puesto de la base de datos.

### 4. **Gestión de Tareas**
- **Ver tareas:** Muestra todas las tareas asignadas.
- **Agregar tarea:** Permite crear y asignar una nueva tarea a un empleado.
- **Editar tarea:** Modifica los detalles de una tarea existente.
- **Eliminar tarea:** Elimina una tarea del sistema.

### 5. **Navegación**
- El sistema cuenta con una barra lateral para navegar entre los módulos: Empleados, Puestos, Tareas y la opción de cerrar sesión.
- Una barra superior muestra información del usuario y accesos rápidos.

---

## Flujo Básico de Uso

1. **Iniciar sesión** con usuario y contraseña.
2. **Seleccionar el módulo** deseado desde la barra lateral (Empleados, Puestos o Tareas).
3. **Realizar operaciones CRUD** (Crear, Leer, Actualizar, Eliminar) según el módulo seleccionado.
4. **Cerrar sesión** cuando termine de usar el sistema.

---

## Consideraciones Técnicas

- El sistema valida los datos antes de guardar cualquier registro.
- Los cambios se reflejan en tiempo real en las tablas.
- El acceso a las rutas está protegido por guardas de autenticación.
- Se cuenta con pruebas automáticas para asegurar el correcto funcionamiento de los módulos principales. 