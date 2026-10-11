import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { NotesService } from '../../notes.service';

@Component({
    selector: 'app-note-detail',
    standalone: true,
    imports: [RouterLink],
    template: `
    @if (note() === null) {
      <p>Loading...</p>
    } @else if (note(); as current) {
      <h2>{{ current.id }}. {{ current.title }}</h2>
      <p>{{ current.description }}</p>
    } @else {
      <p>Note not found</p>
    }
    <a routerLink="/notes">← Back to list</a>
  `
})
export class NoteDetailComponent {
    private notesService = inject(NotesService);

    id = input.required<string>(); // приходит из :id в URL

    // null = загружается, undefined = не найдена, Note = найдена
    note = toSignal(
        toObservable(this.id).pipe(
            switchMap((id) =>
                this.notesService.getNote(Number(id)).pipe(
                    catchError(() => of(undefined)),
                ),
            ),
        ),
        { initialValue: null },
    );
}