import {Throw} from '../dice/throw';

export interface BratwurmState {
    thrown: Throw;
    fehlWurf: boolean;
}

export function serializeBratwurmState(state: BratwurmState): string {
    return `fw=${state.fehlWurf},${state.thrown.diceCount.join(',')}`
}
