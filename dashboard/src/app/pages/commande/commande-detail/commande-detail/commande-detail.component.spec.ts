import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeDetailComponent } from './commande-detail.component';

describe('CommandeDetailComponent', () => {
  let component: CommandeDetailComponent;
  let fixture: ComponentFixture<CommandeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
