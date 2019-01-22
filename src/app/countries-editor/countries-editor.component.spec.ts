import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesEditorComponent } from './countries-editor.component';

describe('CountriesEditorComponent', () => {
  let component: CountriesEditorComponent;
  let fixture: ComponentFixture<CountriesEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountriesEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
