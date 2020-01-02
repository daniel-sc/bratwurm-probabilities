import {BratwurmState} from './bratwurmState';
import {prob} from './bratwurmFunctions';

console.debug = () => null;

const startState: BratwurmState = {
    thrown: {diceCount: [0, 0, 0, 0, 0, 0], probability: 1},
    fehlWurf: false
};


for (let target = 21; target <= 36; target++) {
    console.log(`p(${target}):`, prob(target, startState));
}
