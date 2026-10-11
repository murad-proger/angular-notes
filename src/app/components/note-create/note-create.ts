import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotesService } from '../../notes.service';

@Component({
  selector: 'app-note-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  styleUrl: './note-create.css',
  template: `
    <h2>Create Note</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label for="title">Title</label>
        <input id="title" type="text" formControlName="title" />
        @if (title.hasError('required') && (title.touched || title.dirty)) {
          <p class="error">Title is required</p>
        }
      </div>

      <div>
        <label for="description">Description</label>
        <textarea id="description" formControlName="description"></textarea>
      </div>

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }

      <div class="actions">
        <button type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Saving...' : 'Submit' }}
        </button>
        <a routerLink="/notes" class="cancel-link">Cancel</a>
      </div>
    </form>

    <a routerLink="/notes" class="back-link">← Back to list</a>
  `
})
export class NoteCreateComponent {
  private notesService = inject(NotesService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
  });

  get title() {
    return this.form.controls.title;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.notesService.createNote(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/notes']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to create note');
      },
    });
  }
}
