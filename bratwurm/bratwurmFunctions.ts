import {BratwurmState, serializeBratwurmState} from './bratwurmState';
import {sum} from 'mathjs';
import {DICE_FACES, getAllThrows, Throw} from '../dice/throw';


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

function* getNextStateForThrow(state: BratwurmState, wurf: Throw): IterableIterator<BratwurmState> {
    const remainingDice = sum(...wurf.diceCount);
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

function* exampleNextStateGen(state: BratwurmState): IterableIterator<BratwurmState> {
    let alreadyThrown = sum(state.thrown.diceCount);
    if (state.fehlWurf || alreadyThrown === TOTAL_DICES) {
        return;
    }
    const remainingDice = TOTAL_DICES - alreadyThrown;
    console.debug('remainingDice: ', remainingDice);
    for (const wurf of getAllThrows(remainingDice)) {
        console.debug('wurf: ', wurf);
        for (const next of getNextStateForThrow(state, wurf)) {
            yield next;
        }
    }
}

export function getSum(diceCount: number[]): number {
    return diceCount.reduce((acc, curr, i) => acc + (i < 5 ? i + 1 : 5) * curr, 0)
}

// TODO 'at least'..
// TODO precision?
export function prob(target: number, state: BratwurmState, cache?: Map<string, number>): number {
    if (!cache) {
        cache = new Map<string, number>();
    }
    const stateKey = serializeBratwurmState(state);
    if (!cache.has(stateKey)) {
        console.debug('computing for state: ', stateKey);
        const currentSum = getSum(state.thrown.diceCount);
        const diceUsed = sum(...state.thrown.diceCount);
        if (state.fehlWurf || currentSum > target) {
            return 0;
        }
        if (currentSum === target) {
            return 1;
        }
        if (diceUsed === TOTAL_DICES) {
            return 0;
        }

        const remainingDice = TOTAL_DICES - diceUsed;
        let probTotal = 0;
        for (const wurf of getAllThrows(remainingDice)) {
            probTotal += wurf.probability * Math.max(...([...getNextStateForThrow(state, wurf)].map(s => prob(target, s, cache))));
        }
        cache.set(stateKey, probTotal);
        console.debug('result: ', probTotal);
    }
    return cache.get(stateKey)!;
}
