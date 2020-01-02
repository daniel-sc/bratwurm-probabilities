import {probAtLeast, probExact, TARGETS, TOTAL_DICES} from './bratwurmFunctions';
import * as math from 'mathjs';
import {Fraction, larger, sum} from 'mathjs';
import {getAllThrows} from '../dice/throw';

console.debug = () => null;

const caches = new Map<number, Map<string, Fraction>>();
TARGETS.forEach(t => caches.set(t, new Map<string, Fraction>()));

// run with cli argument 'sum' to get 'at least' semantics:
const probFunction = process.argv.slice(2).some(arg => arg === 'sum') ? probAtLeast : probExact;

for (let diceCount = 0; diceCount < TOTAL_DICES; diceCount++) {
    for (const t of getAllThrows(diceCount)) {
        const probs = TARGETS.map(target => probFunction(target, {
            thrown: t,
            fehlWurf: false
        }, caches.get(target)) as Fraction);
        if (larger(sum(...probs), 0)) { // only non-trivial results
            console.log(`situation=${t.diceCount.join(',')}: ${TARGETS.map((target, i) => `${target}=${math.number(probs[i])}`).join(',')}`);
        }
    }
}
