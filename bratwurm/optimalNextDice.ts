import * as math from 'mathjs';
import {Fraction, larger, sum} from 'mathjs';
import {probAtLeast, probExact, situations, TARGETS, TOTAL_DICES} from './bratwurmFunctions';
import {BratwurmState} from './bratwurmState';

console.debug = () => null;

const caches = new Map<number, Map<string, Fraction>>();
TARGETS.forEach(t => caches.set(t, new Map<string, Fraction>()));

// run with cli argument 'sum' to get 'at least' semantics:
const probFunction = process.argv.slice(2).some(arg => arg === 'sum') ? probAtLeast : probExact;

const orderedSituations = [...situations()];
orderedSituations.sort((a, b) => a.diceCount.join('') < b.diceCount.join('') ? -1 : 1);


for (const t of orderedSituations) {
    const unusedDice = t.diceCount.reduce((acc, count, i) => count === 0 ? [...acc, i] : acc, []);
    // console.log('unused dice: ', unusedDice);
    const remaining = TOTAL_DICES - sum(...t.diceCount);

    const originalState: BratwurmState = {
        thrown: t,
        fehlWurf: false
    };
    const probs = TARGETS.map(target => probFunction(target, originalState, caches.get(target)) as Fraction);

    if (larger(sum(...probs), 0) && probs.some(p => larger(p, 0) && larger(1, p))) { // only non-trivial results
        unusedDice.forEach((unusedDice: number) => {


            for (let diceCount = 1; diceCount <= remaining; diceCount++) {
                const newDiceCount = [...t.diceCount];
                newDiceCount[unusedDice] = diceCount;
                const state: BratwurmState = {
                    thrown: {...t, diceCount: newDiceCount},
                    fehlWurf: false
                };
                const probs = TARGETS.map(target => probFunction(target, state, caches.get(target)) as Fraction);
                if (larger(sum(...probs), 0) && probs.some(p => larger(p, 0) && larger(1, p))) { // only non-trivial results
                    // console.log('probs: ', probs);
                    console.log(`situation=${t.diceCount.join(',')} (${diceCount}x${unusedDice + 1}): ${TARGETS.map((target, i) => `${target}=${math.number(probs[i])}`).join(',')}`);
                }
            }
        });
    }
}
