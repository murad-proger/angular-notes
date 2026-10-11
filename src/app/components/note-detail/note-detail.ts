import { Component, computed, inject, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NotesService } from "../../notes.service";

@Component({
    selector: 'app-note-detail',
    standalone: true,
    imports: [RouterLink],
    styleUrl: './note-detail.css',
    template: `
        @if (note(); as note) {
        <h2>{{ note.id }}. {{ note.title }}</h2>
        } @else {
        <p>Note not found</p>
        }
        <a routerLink="/notes">← Back to list</a>
    `
})

export class NoteDetailComponent {
    private notesService = inject(NotesService);

    id = input.required<string>(); // приходит из :id в URL
    note = computed(() => this.notesService.getNote(Number(this.id())));
}