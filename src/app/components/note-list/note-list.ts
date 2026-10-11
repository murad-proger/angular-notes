import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { NoteItemComponent } from "../note-item/note-item";
import { type Note, NotesService } from '../../notes.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [NoteItemComponent, RouterLink, ReactiveFormsModule,],
  styleUrl: './note-list.css',
  template: `
    <h2>Note List</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label for="title">Title</label>
        <input id="title" type="text" formControlName="title" />
        @if (title.hasError('required') && (title.touched || title.dirty)) {
          <p>Title is required</p>
        }
      </div>

      <div>
        <label for="description">Description</label>
        <textarea id="description" formControlName="description"></textarea>
      </div>

      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>

    <p>
      Search query:
      @if (search()) {
        <strong>{{ search() }}</strong>
      } @else {
        <em>not set</em>
      }
    </p>

    <nav>
      <a routerLink="/notes" [queryParams]="{ search: 'angular' }">search=angular</a>
      <span> | </span>
      <a routerLink="/notes" [queryParams]="{ search: 'signals' }">search=signals</a>
      <span> | </span>
      <a routerLink="/notes">clear</a>
    </nav>

    @if (actionError()) {
      <p>{{ actionError() }}</p>
    }

    @if (loading()) {
      <p>Loading...</p>
    } @else if (error()) {
      <p>{{ error() }}</p>
      <button type="button" (click)="loadNotes()">Retry</button>
    } @else {
      <div>
        @for (note of notes(); track note.id) {
          <app-note-item [noteId]="note.id" [title]="note.title" (delete)="onDelete($event)"></app-note-item>
        } @empty {
          <p>No notes found</p>
        }
      </div>
    }
  `
})
export class NoteListComponent implements OnInit {
  private notesService = inject(NotesService)
  private route = inject(ActivatedRoute);

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

    this.actionError.set(null);
    this.notesService.createNote(this.form.getRawValue()).subscribe({
      next: (created) => {
        this.notes.update((notes) => [...notes, created]);
        this.form.reset();
      },
      error: () => this.actionError.set('Failed to create note'),
    });
  }

  search = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('search') ?? '')),
    { initialValue: '' }
  )

  notes = signal<Note[]>([]);
  loading = signal(true);            // true сразу, чтобы не мелькало «No notes found»
  error = signal<string | null>(null);       // ошибка загрузки списка
  actionError = signal<string | null>(null); // ошибка создания / удаления

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes() {
    this.loading.set(true);
    this.error.set(null);

    this.notesService.getNotes().subscribe({
      next: (notes) => {
        this.notes.set(notes);
        this.loading.set(false);
        console.log(`NoteListComponent initialized. Notes count: ${notes.length}`);
      },
      error: () => {
        this.error.set('Failed to load notes');
        this.loading.set(false);
      },
    });
  }

  onDelete(id: number) {
    this.actionError.set(null);
    this.notesService.deleteNote(id).subscribe({
      next: () => this.notes.update((notes) => notes.filter((note) => note.id !== id)),
      error: () => this.actionError.set('Failed to delete note'),
    });
  }
}