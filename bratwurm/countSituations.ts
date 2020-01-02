import {getAllThrows} from '../dice/throw';
import {TOTAL_DICES} from './bratwurmFunctions';

console.debug = () => null;

let count = 0;
for (let diceCount = 0; diceCount < TOTAL_DICES; diceCount++) {
    for (const t of getAllThrows(diceCount)) {
        count++;
    }
}

// this still includes irrelevant situations (e.g. '7x1'):
console.log('situations with up to 7 dice: ', count);

