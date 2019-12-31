import {BratwurmState} from './bratwurmState';
import {sum} from 'mathjs';
import {DICE_FACES, getAllThrows} from '../dice/throw';


export const TOTAL_DICES = 8;

export function probabilityOfFehlwurf(state: BratwurmState) {
    const stateWithProb100 = {...state, thrown: {...state.thrown, probability: 1}};
    let fehlwurfProb = 0;
    for (const nextState of exampleNextStateGen(stateWithProb100)) {
        console.debug('next state: ', nextState);
        if (nextState.fehlWurf) {
            fehlwurfProb += nextState.thrown.probability;
        }
    }
    return fehlwurfProb;
}

function* exampleNextStateGen(state: BratwurmState): IterableIterator<BratwurmState> {
    let alreadyThrown = sum(state.thrown.diceCount);
    if (state.fehlWurf || alreadyThrown === TOTAL_DICES) {
        return;
    }
    const remainingDice = TOTAL_DICES - alreadyThrown;
    console.debug('remainingDice: ', remainingDice);
    for (const wurf of getAllThrows(remainingDice)) {
        console.debug('wurf: ', wurf);
        let fehlWurf = true;
        for (let d = 0; d < DICE_FACES; d++) {
            if (state.thrown.diceCount[d] === 0 && wurf.diceCount[d] > 0 &&
                /* fehlwurf wenn kein bratwurm mehr moeglich: */(d === DICE_FACES - 1 || state.thrown.diceCount[DICE_FACES - 1] > 0 || wurf.diceCount[d] < remainingDice)) {
                console.debug('state: ', state);
                console.debug('throw:', wurf);
                const newThrown = [...state.thrown.diceCount];
                newThrown[d] = wurf.diceCount[d];
                fehlWurf = false;
                yield {
                    ...state,
                    thrown: {diceCount: newThrown, probability: state.thrown.probability * wurf.probability}, // TODO these probs cannot be summed!
                }
            }
        }
        if (fehlWurf) {
            yield {
                ...state,
                thrown: {...state.thrown, probability: state.thrown.probability * wurf.probability},
                fehlWurf: true
            };
        }
    }
    return;
}

console.log('prob of fehlwurf: ', probabilityOfFehlwurf({
    thrown: {diceCount: [0, 0, 0, 0, 0, 7], probability: 1},
    fehlWurf: false
}));

/*let i = 0;
for (const wurf of getAllThrows(2)) {
    console.log('wurf: ', i++, wurf);
}*/

/*for (const nextState of exampleNextStateGen({
    thrown: {diceCount: [6, 0, 0, 0, 0, 0], probability: 1},
    fehlWurf: false
})) {
    console.log('next: ', nextState);
}*/
