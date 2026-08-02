import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  query = '';
  movies = signal<any[]>([]);
  loading = signal(false);
  error = signal('');

  selected = signal<any | null>(null);
  detailLoading = signal(false);

  private apiKey = 'c4c8e2e570e688fdde2a79ba97bb74e9';

  constructor(private http: HttpClient) {}

  search() {
    const q = this.query.trim();
    if (!q) return;
    this.loading.set(true);
    this.error.set('');
    this.movies.set([]);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&language=es-ES&query=${encodeURIComponent(q)}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.results && res.results.length > 0) {
          this.movies.set(res.results);
        } else {
          this.error.set('No se encontraron resultados.');
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Error al conectar con la API.');
      }
    });
  }

  openDetail(id: number) {
    this.detailLoading.set(true);
    this.selected.set(null);
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}&language=es-ES`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.detailLoading.set(false);
        this.selected.set(res);
      },
      error: () => {
        this.detailLoading.set(false);
      }
    });
  }

  close() {
    this.selected.set(null);
  }
}
