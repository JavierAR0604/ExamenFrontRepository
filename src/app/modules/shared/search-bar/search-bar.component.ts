
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-search-bar',
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, MatPaginatorModule,CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent { 
  searchText = ""

  constructor() {}

  onSearch(): void {
    console.log("Buscando:", this.searchText)
    // Aquí puedes agregar tu lógica de búsqueda
  }

  onAdd(): void {
    console.log("Agregando nuevo elemento")
    // Aquí puedes agregar tu lógica para agregar elementos
  }

  clearSearch(): void {
    this.searchText = ""
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.onSearch()
    }
  }

  applyFilter(): void {
    // Filtrar en tiempo real mientras escribes
    console.log("Filtrando:", this.searchText)
  }
}
