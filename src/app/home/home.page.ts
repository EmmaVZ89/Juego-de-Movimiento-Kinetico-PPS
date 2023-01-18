import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as moment from 'moment';

import { IonSlides } from '@ionic/angular';
import { ViewChild } from '@angular/core';

import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from '@ionic-native/device-motion/ngx';

import { LoadingController } from '@ionic/angular';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('slides', { static: false }) slides: IonSlides;
  watch: any;

  user: any = null;
  menu: number = 0;

  currentCharacter: string;
  imageCharacter: any;
  pathImageCharacter: string = '';

  imageWidth: any;
  imageHeight: any;
  screenWidth: any;
  screenHeight: any;
  left: any;
  top: any;
  scale: number = 0.1;
  gameStarted: boolean = false;
  gameOver: boolean = false;
  velocity: number = 0;
  score: number = 0;
  idInterval: any;
  timePassed: number = 0;

  loading: any;

  constructor(
    private authService: AuthService,
    private deviceMotion: DeviceMotion,
    private loadingController: LoadingController,
    private gameService: GameService
  ) {} // end of constructor

  ngOnInit(): void {
    this.showLoading('');
    this.authService.user$.subscribe((user: any) => {
      this.loading.dismiss();
      if (user) {
        this.user = user;
      } else {
        // this.router.navigate(['/login']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.watch = this.deviceMotion
      .watchAcceleration({ frequency: 10 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.handleAcceleration(acceleration);
      });
  }

  ngOnDestroy() {
    this.watch.unsubscribe();
  }

  handleAcceleration(acceleration: DeviceMotionAccelerationData) {
    if (this.imageCharacter != undefined && this.gameStarted) {
      this.velocity += 0.0007;
      this.imageWidth = this.imageCharacter.offsetWidth;
      this.imageHeight = this.imageCharacter.offsetHeight;
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.left = this.imageCharacter.offsetLeft;
      this.top = this.imageCharacter.offsetTop;
      if (
        this.left + this.imageWidth > this.screenWidth + this.imageWidth / 2 ||
        this.left < 0 + this.imageWidth / 2
      ) {
        //Si llega al borde izquierdo o derecho
        this.gameStarted = false;
        this.gameOver = true;
        clearInterval(this.idInterval);
        const game: any = {
          userUid: this.user.userUid,
          userName: this.user.userName,
          characterImage: this.pathImageCharacter,
          score: this.score,
          time: this.getTime(),
        };
        this.gameService.createGame(game);
        // console.log('image reached left or right bounds');
      } else {
        if (acceleration.x < 0) {
          this.imageCharacter.style.left =
            this.left +
            -1 * (acceleration.x * this.scale + -1 * this.velocity) +
            'px';
        } else {
          this.imageCharacter.style.left =
            this.left +
            -1 * (acceleration.x * this.scale + this.velocity) +
            'px';
        }
      }

      if (
        this.top + this.imageHeight >
          this.screenHeight + this.imageHeight / 2 ||
        this.top < 0 + this.imageHeight / 2
      ) {
        //Si llega al borde arriba o abajo
        this.gameStarted = false;
        this.gameOver = true;
        clearInterval(this.idInterval);
        const game: any = {
          userUid: this.user.userUid,
          userName: this.user.userName,
          characterImage: this.pathImageCharacter,
          score: this.score,
          time: this.getTime(),
        };
        this.gameService.createGame(game);
        // console.log('image reached top or bottom bounds');
      } else {
        if (acceleration.y < 0) {
          this.imageCharacter.style.top =
            this.top + acceleration.y * this.scale + -1 * this.velocity + 'px';
        } else {
          this.imageCharacter.style.top =
            this.top + acceleration.y * this.scale + this.velocity + 'px';
        }
      }
    }
  }

  logoutUser() {
    this.authService.signOut();
  } // end of logoutUser

  // [1-DC | 2-MARVEL | 3-JUEGO]
  async chooseMenu(view: number) {
    await this.showLoading('');
    setTimeout(() => {
      this.menu = view;
      if (view == 0) {
        this.imageCharacter = undefined;
        this.gameStarted = false;
      }
      this.loading.dismiss();
    }, 1000);
  }

  async chooseCharacter(character: string) {
    this.currentCharacter = character;
    this.pathImageCharacter = `../../assets/${character}.png`;
    this.chooseMenu(3);
    setTimeout(() => {
      this.gameStarted = true;
      this.gameOver = false;
      this.timePassed = 0;
      this.score = 0;
      this.velocity = 0;
      this.imageCharacter = document.getElementById('img-juego');
      this.idInterval = setInterval(() => {
        this.score += 10;
        this.timePassed++;
      }, 1000);
    }, 1250);
  }

  getTime() {
    let minutes: string | number = Math.floor(this.timePassed / 60);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let seconds = this.timePassed % 60;
    return minutes + "'" + ':' + (seconds < 10 ? '0' : '') + seconds + "''";
  }

  resetGame() {
    this.menu = -1;
    this.imageCharacter = undefined;
    this.gameStarted = false;
    this.chooseCharacter(this.currentCharacter);
  }

  convertDateToUnix(photo: any) {
    const initialDate = photo.hour;
    const splitDate = initialDate.split(' ');
    const date = splitDate[0].split('-');
    const time = splitDate[1].split(':');
    const dd = date[0];
    const mm = date[1] - 1;
    const yyyy = date[2];
    const hh = time[0];
    const min = time[1];
    const ss = time[2];
    const dateDate = new Date(yyyy, mm, dd, hh, min, ss);

    return dateDate.getTime();
  } // end of convertDateToUnix

  async showLoading(message: string) {
    try {
      this.loading = await this.loadingController.create({
        message: message,
        spinner: 'crescent',
        showBackdrop: true,
      });
      this.loading.present();
    } catch (error) {
      console.log(error.message);
    }
  }
}
