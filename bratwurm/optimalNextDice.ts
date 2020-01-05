import {Fraction, larger, default as math, sum, MathType} from 'mathjs';
import {probAtLeast, probExact, situations, TARGETS, TOTAL_DICES} from './bratwurmFunctions';

console.debug = () => null;

const caches = new Map<number, Map<string, Fraction>>();
TARGETS.forEach(t => caches.set(t, new Map<string, Fraction>()));

// run with cli argument 'sum' to get 'at least' semantics:
const probFunction = process.argv.slice(2).some(arg => arg === 'sum') ? probAtLeast : probExact;

const target = 21; // TODO
const cache = new Map<string, Fraction>();

for (const t of situations()) {
    const unusedDice = t.diceCount.reduce((acc, count, i) => count === 0 ? [...acc, i] : acc, []);
    const remaining = unusedDice.length;
    for (let diceCount = 1; diceCount <= remaining; diceCount++) {
        const probs = unusedDice.map(dice => {
            const newDiceCount = [...t.diceCount];
            newDiceCount[dice] = remaining;
            return probFunction(target, {
                thrown: {diceCount: newDiceCount, probability: 1},
                fehlWurf: false
            }, cache);
        });

    }
    const probs = TARGETS.map(target => probFunction(target, {
        thrown: t,
        fehlWurf: false
    }, caches.get(target)) as Fraction);
    if (larger(sum(...probs), 0)) { // only non-trivial results
        console.log(`situation=${t.diceCount.join(',')}: ${TARGETS.map((target, i) => `${target}=${math.number(probs[i])}`).join(',')}`);
    }
}
