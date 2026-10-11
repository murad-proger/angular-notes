import { Routes } from '@angular/router';
import { NoteListComponent } from './components/note-list/note-list';
import { NoteDetailComponent } from './components/note-detail/note-detail';

export const routes: Routes = [
    { path: '', redirectTo: 'notes', pathMatch: 'full' },
    { path: 'notes', component: NoteListComponent },
    { path: 'notes/:id', component: NoteDetailComponent },
];