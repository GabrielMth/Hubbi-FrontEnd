import { Component } from '@angular/core';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule  } from 'primeng/tooltip';

@Component({
  selector: 'app-detalhestask',
  imports: [Tag, Dialog, ButtonModule, TooltipModule],
  templateUrl: './detalhestask.component.html',
  styleUrl: './detalhestask.component.scss'
})
export class DetalhestaskComponent {

  dialogDetailsTaskVisible: boolean = false;

}
