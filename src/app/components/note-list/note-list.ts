import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, map } from 'rxjs';
import { NoteItemComponent } from "../note-item/note-item";
import { type Note, NotesService } from '../../notes.service';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [NoteItemComponent, RouterLink],
  styleUrl: './note-list.css',
  template: `
    <h2>Note List</h2>

    <div class="create-note-box">
      <a routerLink="/notes/new" class="create-button">+ Create new note</a>
    </div>

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
      <p class="action-error">{{ actionError() }}</p>
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
  private notesService = inject(NotesService);
  private route = inject(ActivatedRoute);
  private deleting = new Set<number>();

  search = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('search') ?? '')),
    { initialValue: '' }
  );

  notes = signal<Note[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  actionError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes() {
    this.loading.set(true);
    this.error.set(null);

    this.notesService.getNotes().pipe(
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (notes) => this.notes.set(notes),
      error: () => this.error.set('Failed to load notes'),
    });
  }

  onDelete(id: number) {
    if (this.deleting.has(id)) return;
    this.deleting.add(id);
    this.actionError.set(null);

    this.notesService.deleteNote(id).pipe(
      finalize(() => this.deleting.delete(id)),
    ).subscribe({
      next: () => this.notes.update((notes) => notes.filter((note) => note.id !== id)),
      error: () => this.actionError.set('Failed to delete note'),
    });
  }
}