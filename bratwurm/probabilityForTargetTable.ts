import {BratwurmState} from './bratwurmState';
import {prob} from './bratwurmFunctions';
import * as math from 'mathjs';
import {Fraction, fraction} from 'mathjs';

console.debug = () => null;

const startState: BratwurmState = {
    thrown: {diceCount: [0, 0, 0, 0, 0, 0], probability: fraction(1) as Fraction},
    fehlWurf: false
};


for (let target = 21; target <= 36; target++) {
    console.log(`p(${target}):`, math.string(prob(target, startState)));
}
