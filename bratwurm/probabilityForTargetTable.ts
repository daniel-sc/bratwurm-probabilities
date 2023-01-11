import {computeProbs, TARGETS} from './bratwurmFunctions';
import {sum} from 'mathjs';

console.debug = () => null;

// run with cli argument 'sum' to get 'at least' semantics:
const sumF = process.argv.slice(2).some(arg => arg === 'sum');


for (const x of computeProbs(sumF)) {
    console.log(`situation=${x.diceCounts.join(',')}: ${TARGETS.map((target, i) => `${target}=${x.probs[i]}`).join(',')}`);
}
