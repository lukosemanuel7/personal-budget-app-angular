import { Component, ViewChild } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { MenuComponentService } from './menu-component.service';
import { MenuComponent } from './menu/menu.component';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MenuComponentService, MenuComponent]
})
export class AppComponent {
  title = 'personal-budget-app';

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  public modalRef: BsModalRef;

  @ViewChild('childModal', { static: false }) childModal: ModalDirective;

  constructor(private idle: Idle, private keepalive: Keepalive,
    private router: Router, private modalService: BsModalService, private authService: AuthService) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(20);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(20);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.'
      console.log(this.idleState);
      this.setIdleRefreshToken();
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.childModal.hide();
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      this.router.navigate(['/login']);
    });

    idle.onIdleStart.subscribe(() => {
        this.idleState = 'You\'ve gone idle!'
        console.log(this.idleState);
        this.childModal.show();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!'
      console.log(this.idleState);
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(50);

    keepalive.onPing.subscribe(() => {
      this.lastPing = new Date()
      // this.setIdleRefreshToken();

    });

    this.authService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch()
        this.timedOut = false;
      } else {
        idle.stop();
      }
    })

    // this.reset();
  }

  setIdleRefreshToken(){
    console.log("Inside setIdleRefreshToken")
    this.authService.refreshToken()
            .pipe(first())
            .subscribe(
                data => {
                  console.log(data);
                  this.authService.setUserLoggedIn(true);
                    // this.router.navigate(['/dashboard']);
                    let token = data.token;
                    this.authService.refreshTokenData(token);
                },
                error => {
                  return;
                });
  }

  reset() {
    this.idle.watch();
    //xthis.idleState = 'Started.';

    this.timedOut = false;
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  stay() {
    this.childModal.hide();
    this.setIdleRefreshToken();
    this.reset();
  }

  logout() {
    this.childModal.hide();
    this.authService.setUserLoggedIn(false);
    this.router.navigate(['/login']);
  }


}
