import {combinations, Fraction, fraction, MathType, pow, sum} from 'mathjs';

export const DICE_FACES = 6;

export interface Throw {
    diceCount: number[];
    probability: MathType;
}

/** throws are ordered lexicographically: 002, 011, 020, 110, .. */
export function getNextThrow(curr: Throw): Throw {
    const lastPosIndex = Math.max(...curr.diceCount.map((v, i) => v > 0 ? i : 0));
    const newDiceCount = [...curr.diceCount];
    newDiceCount[lastPosIndex]--;
    newDiceCount[lastPosIndex - 1]++;
    for (let i = lastPosIndex; i < DICE_FACES - 1; i++) {
        newDiceCount[DICE_FACES - 1] += newDiceCount[i];
        newDiceCount[i] = 0;
    }
    return {...curr, diceCount: newDiceCount, probability: probabilityOf(newDiceCount)};
}


export function probabilityOf(diceCount: number[]): Fraction {
    const total = sum(...diceCount);
    if (total <= 0) {
        return fraction(0) as Fraction;
    }
    let remainingDiceCount = total;
    let possibilities = 1;
    console.debug('diceCount: ', diceCount);
    console.debug('total: ', total);
    diceCount.forEach(count => {
        possibilities *= combinations(remainingDiceCount, count) as number;
        remainingDiceCount -= count;
    });
    return fraction(possibilities, <number>pow(DICE_FACES, total)) as Fraction;
}

export function* getAllThrows(diceCount: number): IterableIterator<Throw> {
    let initialDiceCount = Array.from({length: DICE_FACES}).map(() => 0);
    initialDiceCount[DICE_FACES - 1] = diceCount;
    let current: Throw = {diceCount: initialDiceCount, probability: probabilityOf(initialDiceCount)};
    do {
        yield current;
        current = getNextThrow(current);
    } while (current.diceCount[0] < diceCount);
    if (diceCount > 0) {
        yield current;
    }
    return undefined;
}
