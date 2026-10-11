import { Component, OnInit, inject } from '@angular/core';
import { NoteItemComponent } from "../note-item/note-item";
import { type Note, NotesService } from '../../notes.service';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [NoteItemComponent],
  styleUrl: './note-list.css',
  template: `
    <h2>Note List</h2>
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

  notes: Note[] = this.notesService.getNotes();

  ngOnInit(): void {
    console.log(`NoteListComponent initialized. Notes count: ${this.notes.length}`);
  }

  onDelete(id: number) {
    this.notesService.deleteNote(id);
    this.notes = this.notesService.getNotes();
  }
}