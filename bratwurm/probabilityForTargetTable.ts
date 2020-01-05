import {probAtLeast, probExact, situations, TARGETS} from './bratwurmFunctions';
import * as math from 'mathjs';
import {Fraction, larger, sum} from 'mathjs';

console.debug = () => null;

const caches = new Map<number, Map<string, Fraction>>();
TARGETS.forEach(t => caches.set(t, new Map<string, Fraction>()));

// run with cli argument 'sum' to get 'at least' semantics:
const probFunction = process.argv.slice(2).some(arg => arg === 'sum') ? probAtLeast : probExact;

for (const t of situations()) {
    const probs = TARGETS.map(target => probFunction(target, {
        thrown: t,
        fehlWurf: false
    }, caches.get(target)) as Fraction);
    if (larger(sum(...probs), 0)) { // only non-trivial results
        console.log(`situation=${t.diceCount.join(',')}: ${TARGETS.map((target, i) => `${target}=${math.number(probs[i])}`).join(',')}`);
    }
}
