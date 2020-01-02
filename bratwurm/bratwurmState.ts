import {State} from '../state';
import {Throw} from '../dice/throw';

export interface BratwurmState extends State {
    thrown: Throw;
    fehlWurf: boolean;
}

export function serializeBratwurmState(state: BratwurmState): string {
    return `fw=${state.fehlWurf},${state.thrown.diceCount.join(',')}`
}
