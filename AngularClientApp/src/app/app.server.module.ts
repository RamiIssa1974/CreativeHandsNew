import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
 
@NgModule({
  imports: [
    AppModule,    
    // Remove ModuleMapLoaderModule
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
