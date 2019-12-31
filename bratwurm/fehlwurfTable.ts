import {probabilityOfFehlwurf, TOTAL_DICES} from './bratwurmFunctions';
import {DICE_FACES} from '../dice/throw';

console.debug = () => null;

for (const existingBratwurm of [true, false]) {
    for (let existingFaces = existingBratwurm ? 1 : 0; existingFaces < DICE_FACES; existingFaces++) {
        for (let remainingDice = TOTAL_DICES - existingFaces; remainingDice > (existingFaces > 0 ? 0 : TOTAL_DICES - existingFaces - 1); remainingDice--) {
            const existingDice = Array.from({length: DICE_FACES}).map(() => 0);
            if (existingBratwurm) {
                for (let i = DICE_FACES - 1; i >= DICE_FACES - existingFaces; i--) {
                    existingDice[i] = i === DICE_FACES - 1 ? TOTAL_DICES - remainingDice - existingFaces + 1 : 1;
                }
            } else {
                for (let i = 0; i < existingFaces; i++) {
                    existingDice[i] = i === 0 ? TOTAL_DICES - remainingDice - existingFaces + 1 : 1;
                }
            }
            console.debug('existingDice: ', existingDice);
            const prob = probabilityOfFehlwurf({
                thrown: {diceCount: existingDice, probability: 1},
                fehlWurf: false
            });
            console.log(`Probability for Fehlwurf (existingBratwurm=${existingBratwurm}, existingFaces=${existingFaces}, remainingDice=${remainingDice}): ${prob}`);
        }
    }
}



