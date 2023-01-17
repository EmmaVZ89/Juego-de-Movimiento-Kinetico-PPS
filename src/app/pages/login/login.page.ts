import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  admin: boolean = false;
  usuario: boolean = false;
  invitado: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.getUserLogged().subscribe((res) => {
      if (res !== null) {
        this.router.navigate(['/home']);
      }
    });
  }

  loginUser() {
    if (this.email && this.password) {
      this.auth.signIn(this.email, this.password);
    } else {
      this.auth.toast('¡Por favor completa todos los campos!', 'warning');
    }
  } // end of loginUser

  loadFastUser(numUser: number) {
    const admin = <HTMLInputElement>document.getElementById('admin');
    const usuario = <HTMLInputElement>document.getElementById('usuario');
    const invitado = <HTMLInputElement>document.getElementById('invitado');
    switch (numUser) {
      case 1:
        usuario.checked = false;
        invitado.checked = false;
        this.email = 'admin@admin.com';
        this.password = '111111';
        this.auth.toast(
          '¡Usuario cargado, ahora puedes Iniciar Sesión!',
          'secondary'
        );
        this.admin = true;
        this.usuario = false;
        this.invitado = false;
        break;
      case 2:
        usuario.checked = false;
        admin.checked = false;
        this.email = 'invitado@invitado.com';
        this.password = '222222';
        this.auth.toast(
          '¡Usuario cargado, ahora puedes Iniciar Sesión!',
          'secondary'
        );
        this.admin = false;
        this.usuario = false;
        this.invitado = true;
        break;
      case 3:
        admin.checked = false;
        invitado.checked = false;
        this.email = 'usuario@usuario.com';
        this.password = '333333';
        this.auth.toast(
          '¡Usuario cargado, ahora puedes Iniciar Sesión!',
          'secondary'
        );
        this.admin = false;
        this.usuario = true;
        this.invitado = false;
        break;
      default:
        break;
    }
  } // end of loadFastUser
}
