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
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, MatPaginatorModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent { 
  @Input() placeholder: string = "Buscar...";
  @Input() showAddButton: boolean = true;
  @Input() addButtonText: string = "Nuevo";
  
  @Output() searchChange = new EventEmitter<string>();
  @Output() addClick = new EventEmitter<void>();
  @Output() clearSearch = new EventEmitter<void>();

  searchText = "";

  constructor() {}

  onSearch(): void {
    this.searchChange.emit(this.searchText);
  }

  onAdd(): void {
    this.addClick.emit();
  }

  onClearSearch(): void {
    this.searchText = "";
    this.clearSearch.emit();
    this.searchChange.emit("");
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.onSearch();
    }
  }

  applyFilter(): void {
    // Emitir el cambio en tiempo real mientras escribes
    this.searchChange.emit(this.searchText);
  }
}
