import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module'; // Import your AppModule

@NgModule({
  imports: [
    AppModule,  // Import AppModule
    ServerModule,
    // Any other server-specific modules
  ],
  bootstrap: [AppComponent], // Bootstraps the AppComponent
})
export class AppServerModule {}
