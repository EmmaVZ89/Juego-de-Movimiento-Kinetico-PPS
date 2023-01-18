import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private angularFirestore: AngularFirestore) {}

  createGame(game: any) {
    this.angularFirestore.collection<any>('juegos').add(game);
  }

  getGames() {
    const collection = this.angularFirestore.collection<any>('juegos');
    return collection.valueChanges();
  }
}
