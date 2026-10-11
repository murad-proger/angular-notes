import { Routes } from '@angular/router';
import { NoteListComponent } from './components/note-list/note-list';
import { NoteDetailComponent } from './components/note-detail/note-detail';
import { NoteCreateComponent } from './components/note-create/note-create';

export const routes: Routes = [
    { path: '', redirectTo: 'notes', pathMatch: 'full' },
    { path: 'notes', component: NoteListComponent },
    { path: 'notes/new', component: NoteCreateComponent },
    { path: 'notes/:id', component: NoteDetailComponent },
];