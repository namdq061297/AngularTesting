import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class App implements OnInit {
  private translate = inject(TranslateService);
  private storage = inject(StorageService);

  ngOnInit(): void {
    const savedLang = this.storage.get<string>('lang') || 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
  }
}
