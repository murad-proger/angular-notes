import { Component, OnInit, inject } from '@angular/core';
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

    console.log(
      `title: ${this.form.getRawValue().title} \ndescription: ${this.form.getRawValue().description}`
    );
  }

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