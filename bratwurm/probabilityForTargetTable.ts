import {prob, TOTAL_DICES} from './bratwurmFunctions';
import * as math from 'mathjs';
import {Fraction, larger, sum} from 'mathjs';
import {getAllThrows} from '../dice/throw';

console.debug = () => null;

const targets = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
const caches = new Map<number, Map<string, Fraction>>();
targets.forEach(t => caches.set(t, new Map<string, Fraction>()));

for (let diceCount = 0; diceCount < TOTAL_DICES; diceCount++) {
    for (const t of getAllThrows(diceCount)) {
        const probs = targets.map(target => prob(target, {thrown: t, fehlWurf: false}, caches.get(target)) as Fraction);
        if (larger(sum(...probs), 0)) { // only non-trivial results
            console.log(`situation=${t.diceCount.join(',')}: ${targets.map((target, i) => `${target}=${math.number(probs[i])}`).join(',')}`);
        }
    }
}
