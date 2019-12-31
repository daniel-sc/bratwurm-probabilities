import {State} from '../state';
import {Throw} from '../dice/throw';

export interface BratwurmState extends State {
    thrown: Throw;
    fehlWurf: boolean;
}
