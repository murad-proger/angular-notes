import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { NoteItemComponent } from "../note-item/note-item";
import { type Note, NotesService } from '../../notes.service';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [NoteItemComponent, RouterLink],
  styleUrl: './note-list.css',
  template: `
    <h2>Note List</h2>

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


    <div>
        @for (note of notes; track note.id) {
            <app-note-item [noteId]="note.id" [title]="note.title" (delete)="onDelete($event)"></app-note-item>
        } @empty {
            <p>No notes found</p>
        }
    </div>
  `
})
export class NoteListComponent implements OnInit {
  private notesService = inject(NotesService)

  private route = inject(ActivatedRoute);

  search = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('search') ?? '')),
    { initialValue: '' }
  )

  notes: Note[] = this.notesService.getNotes();

  ngOnInit(): void {
    console.log(`NoteListComponent initialized. Notes count: ${this.notes.length}`);
  }

  onDelete(id: number) {
    this.notesService.deleteNote(id);
    this.notes = this.notesService.getNotes();
  }
}