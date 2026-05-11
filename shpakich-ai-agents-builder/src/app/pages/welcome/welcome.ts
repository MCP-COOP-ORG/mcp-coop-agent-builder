import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink, TuiButton],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {}
