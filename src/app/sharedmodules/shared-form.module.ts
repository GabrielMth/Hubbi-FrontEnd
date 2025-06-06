import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Checkbox } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    FloatLabel,
    InputIconModule,
    IconFieldModule,
    InputGroupModule,
    InputGroupAddonModule,
    Checkbox,
    DatePickerModule,
    DividerModule,
    ButtonModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    FloatLabel,
    InputIconModule,
    IconFieldModule,
    InputGroupModule,
    InputGroupAddonModule,
    Checkbox,
    DatePickerModule,
    DividerModule,
    ButtonModule,
  ],
})
export class SharedFormModule {}
