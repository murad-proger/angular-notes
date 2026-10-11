import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-note-item',
  standalone: true,
  imports: [RouterLink],
  // templateUrl: './note-item.html',
  styleUrl: './note-item.css',
  template: `
    <p>
      <a [routerLink]="['/notes', noteId()]">{{ noteId() }}. {{ title() }}</a>
    </p>
    <button (click)="onDelete()">Delete</button>
  `
})
export class NoteItemComponent {
  title = input.required<string>();
  noteId = input.required<number>();

  delete = output<number>();

  onDelete() {
    this.delete.emit(this.noteId());
  }
}
