import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemberListComponent } from './member-list/member-list.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { EditMemberComponent } from './edit-member/edit-member.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './auth.Guard';
import { SignupPageComponent } from './signup-page/signup-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MemberListComponent,
    AddMemberComponent,
    EditMemberComponent,
    LoginPageComponent,
    SignupPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    RouterModule.forRoot([
      // { path: '', component: MemberListComponent},
      { path: '', component: MemberListComponent, },
      { path: 'login', component: LoginPageComponent },
      { path: 'daftar', component: SignupPageComponent },
      { path: 'tambah', component: AddMemberComponent, canActivate: [AuthGuard] },
      { path: 'edit', component: EditMemberComponent, canActivate: [AuthGuard]  },
      { path: 'edit-member/:id', component: EditMemberComponent, canActivate: [AuthGuard]  },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
