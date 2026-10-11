import { Injectable } from "@angular/core";

export interface Note {
    id: number;
    title: string;
}

@Injectable({
    providedIn: 'root',
})

export class NotesService {
    private notes: Note[] = [
        { id: 1, title: 'Learn Angular' },
        { id: 2, title: 'Learn Signals' },
    ];

    getNote(id: number): Note | undefined {
        return this.notes.find((note) => note.id === id);
    }

    getNotes(): Note[] {
        return [...this.notes];
    }

    deleteNote(id: number) {
        this.notes = this.notes.filter((note) => note.id !== id);
    }
}