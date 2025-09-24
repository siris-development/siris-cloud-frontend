import { Component, Input, Output, EventEmitter, signal, computed, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthcareProvider } from '@/features';

@Component({
  selector: 'app-provider-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-autocomplete.component.html',
  styleUrls: ['./provider-autocomplete.component.css']
})
export class ProviderAutocompleteComponent implements OnInit, OnDestroy {
  @Input() providers: HealthcareProvider[] = [];
  @Input() selectedProviderId: string = '';
  @Input() placeholder: string = 'Seleccione un proveedor...';
  @Input() disabled: boolean = false;
  
  @Output() providerSelected = new EventEmitter<string>();
  @Output() providerChange = new EventEmitter<string>();

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  // Estado del componente
  isOpen = signal<boolean>(false);
  searchQuery = signal<string>('');
  selectedProvider = signal<HealthcareProvider | null>(null);
  highlightedIndex = signal<number>(-1);

  // Computed properties
  filteredProviders = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.providers;
    }
    
    return this.providers.filter(provider => {
      const name = (provider.name || '').toLowerCase();
      const identifier = (provider.identifier || '').toLowerCase();
      return name.includes(query) || identifier.includes(query);
    });
  });

  displayText = computed(() => {
    const provider = this.selectedProvider();
    if (provider) {
      return provider.name || provider.identifier || 'Proveedor sin nombre';
    }
    return this.searchQuery() || this.placeholder;
  });

  ngOnInit() {
    // Encontrar el proveedor seleccionado inicialmente
    if (this.selectedProviderId) {
      const provider = this.providers.find(p => p.id === this.selectedProviderId);
      if (provider) {
        this.selectedProvider.set(provider);
        this.searchQuery.set(provider.name || provider.identifier || '');
      }
    }
  }

  ngOnDestroy() {
    // Cleanup si es necesario
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.inputRef?.nativeElement.contains(event.target as Node)) {
      this.closeDropdown();
    }
  }

  onInputFocus() {
    this.isOpen.set(true);
    this.highlightedIndex.set(-1);
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.isOpen.set(true);
    this.highlightedIndex.set(-1);
    
    // Si se borra el texto, limpiar selección
    if (!target.value.trim()) {
      this.clearSelection();
    }
  }

  onInputKeyDown(event: KeyboardEvent) {
    const filtered = this.filteredProviders();
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex.set(
          this.highlightedIndex() < filtered.length - 1 
            ? this.highlightedIndex() + 1 
            : 0
        );
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.set(
          this.highlightedIndex() > 0 
            ? this.highlightedIndex() - 1 
            : filtered.length - 1
        );
        break;
        
      case 'Enter':
        event.preventDefault();
        if (this.highlightedIndex() >= 0 && this.highlightedIndex() < filtered.length) {
          this.selectProvider(filtered[this.highlightedIndex()]);
        }
        break;
        
      case 'Escape':
        this.closeDropdown();
        break;
    }
  }

  selectProvider(provider: HealthcareProvider) {
    this.selectedProvider.set(provider);
    this.searchQuery.set(provider.name || provider.identifier || '');
    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
    
    this.providerSelected.emit(provider.id);
    this.providerChange.emit(provider.id);
  }

  clearSelection() {
    this.selectedProvider.set(null);
    this.searchQuery.set('');
    this.providerSelected.emit('');
    this.providerChange.emit('');
  }

  closeDropdown() {
    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
    
    // Restaurar el texto del proveedor seleccionado si existe
    const provider = this.selectedProvider();
    if (provider) {
      this.searchQuery.set(provider.name || provider.identifier || '');
    }
  }

  getProviderDisplayName(provider: HealthcareProvider): string {
    return provider.name || provider.identifier || 'Proveedor sin nombre';
  }

  getProviderIdentifier(provider: HealthcareProvider): string {
    return provider.identifier || '';
  }
}
