import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
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

    <div class="search-box">
      <input
        type="text"
        class="search-input"
        placeholder="Search notes..."
        [value]="search()"
        (input)="onSearch($any($event.target).value)"
      />
      @if (search()) {
        <button
          type="button"
          class="clear-btn"
          aria-label="Clear search"
          (click)="onClear()"
        ></button>
      }
    </div>

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
        @for (note of filteredNotes(); track note.id) {
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
  private router = inject(Router);
  private deleting = new Set<number>();

  search = signal(this.route.snapshot.queryParamMap.get('search') ?? '');

  notes = signal<Note[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  actionError = signal<string | null>(null);

  filteredNotes = computed(() => {
    const query = this.search().toLowerCase().trim();
    if (!query) return this.notes();
    return this.notes().filter((note) =>
      note.title.toLowerCase().includes(query) ||
      note.description?.toLowerCase().includes(query)
    );
  });

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const q = params.get('search') ?? '';
      if (this.search() !== q) {
        this.search.set(q);
      }
    });
  }

  ngOnInit(): void {
    this.loadNotes();
  }

  onSearch(value: string) {
    this.search.set(value);
    this.router.navigate([], {
      queryParams: { search: value.trim() ? value : null },
      queryParamsHandling: 'merge',
    });
  }

  onClear() {
    this.search.set('');
    this.router.navigate([], {
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
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