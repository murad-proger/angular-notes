import { Injectable, inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Note {
    id: number;
    title: string;
    description: string;
}

export type NewNote = Omit<Note, 'id'>;

const API_URL = 'https://e441bfce1d72a501.mokky.dev/notes';

@Injectable({
    providedIn: 'root',
})

export class NotesService {
    private http = inject(HttpClient)

    getNote(id: number): Observable<Note> {
        return this.http.get<Note>(`${API_URL}/${id}`);
    }

    getNotes(): Observable<Note[]> {
        return this.http.get<Note[]>(API_URL);
    }

    createNote(note: NewNote): Observable<Note> {
        return this.http.post<Note>(API_URL, note);
    }

    deleteNote(id: number): Observable<unknown> {
        return this.http.delete(`${API_URL}/${id}`);
    }
}