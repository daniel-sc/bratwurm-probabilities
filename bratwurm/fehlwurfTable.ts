import {probabilityOfFehlwurf, TOTAL_DICES} from './bratwurmFunctions';

console.debug = () => null;

for (const existingBratwurm of [true, false]) {
    for (let existingFaces = existingBratwurm ? 1 : 0; existingFaces < (existingBratwurm ? TOTAL_DICES : TOTAL_DICES - 1); existingFaces++) {
        for (let remainingDice = TOTAL_DICES - existingFaces; remainingDice > 0; remainingDice--) {
            const existingDice = Array.from({length: TOTAL_DICES}).map(() => 0);
            if (existingBratwurm) {
                for (let i = TOTAL_DICES - 1; i >= TOTAL_DICES - existingFaces; i--) {
                    existingDice[i] = i === TOTAL_DICES - 1 ? TOTAL_DICES - remainingDice - existingFaces + 1 : 1;
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
