import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns: string[] = ['name', 'description', 'actions'];
  isAdding = false;
  editingCategory: Category | null = null;
  newCategory: Omit<Category, '_id' | 'createdAt' | 'updatedAt'> = { name: '', description: '' };

  constructor(private categoryService: CategoryService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.snackBar.open('Erreur lors du chargement des catégories.', 'Fermer', { duration: 3000 });
      }
    );
  }

  addCategory(): void {
    this.categoryService.addCategory(this.newCategory).subscribe(
      (newCategory) => {
        this.isAdding = false;
        this.newCategory = { name: '', description: '' };
        this.loadCategories();
        this.snackBar.open('Catégorie créée avec succès.', 'Fermer', { duration: 3000 });
      },
      (error) => {
        console.error('Erreur lors de la création de la catégorie:', error);
        this.snackBar.open('Erreur lors de la création de la catégorie.', 'Fermer', { duration: 5000 });
      }
    );
  }

  editCategory(category: Category): void {
    this.editingCategory = { ...category };
    this.isAdding = false;
  }

  updateCategory(): void {
    if (this.editingCategory?._id) {
      this.categoryService.updateCategory(this.editingCategory._id, this.editingCategory).subscribe(
        (updatedCategory) => {
          this.editingCategory = null;
          this.loadCategories();
          this.snackBar.open('Catégorie mise à jour avec succès.', 'Fermer', { duration: 3000 });
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la catégorie:', error);
          this.snackBar.open('Erreur lors de la mise à jour de la catégorie.', 'Fermer', { duration: 5000 });
        }
      );
    }
  }

  deleteCategory(id: string | undefined): void {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id).subscribe(
        () => {
          this.loadCategories();
          this.snackBar.open('Catégorie supprimée avec succès.', 'Fermer', { duration: 3000 });
        },
        (error) => {
          console.error('Erreur lors de la suppression de la catégorie:', error);
          this.snackBar.open('Erreur lors de la suppression de la catégorie.', 'Fermer', { duration: 5000 });
        }
      );
    }
  }

  showAddForm(): void {
    this.isAdding = true;
    this.editingCategory = null;
  }

  cancelAdd(): void {
    this.isAdding = false;
    this.newCategory = { name: '', description: '' };
  }

  cancelEdit(): void {
    this.editingCategory = null;
  }
}