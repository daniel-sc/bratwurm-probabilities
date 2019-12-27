interface State {

}

/*function searchDfs(initialState: State, nextStateGen: (State: boolean)) {

}*/

interface Throw {
    diceCount: number[];
}

interface ExampleState extends State {
    thrown: number[];
    fehlWurf: boolean;
    probability: number;
}

const TOTAL_DICES = 8;

function getNextThrow(curr: Throw): Throw {
    // throws are ordered lexicographically: 002, 011, 020, 110, ..
    const lastPosIndex = Math.max(...curr.diceCount.map((v, i) => v > 0 ? i : 0));
    const newDiceCount = [...curr.diceCount];
    newDiceCount[lastPosIndex]--;
    newDiceCount[lastPosIndex - 1]++;
    for (let i = lastPosIndex; i < 5; i++) {
        newDiceCount[5] += newDiceCount[i];
        newDiceCount[i] = 0;
    }
    return {...curr, diceCount: newDiceCount};
}

function* getAllThrows(remainingDice: number): IterableIterator<Throw> {
    let current: Throw = {diceCount: Array.from({length: remainingDice}).map(() => 0)};
    let i = 0;
    current.diceCount[0] = remainingDice;
    while (current.diceCount[5] < remainingDice) {
        yield current;
        if (current[i] === remainingDice) {
            let overflowI = i + 1;
            while (current[overflowI] === 5) {
                current[overflowI] = 0;
                overflowI++;
            }
            current[overflowI]++;
            current[i] = 0;
        } else {
            current[i]++;
        }
    }
    yield {...current};
    return undefined;
}

function* exampleNextStateGen(state: ExampleState): IterableIterator<ExampleState> {
    let alreadyThrown = state.thrown.reduce((acc, curr) => acc + curr, 0);
    if (state.fehlWurf || alreadyThrown === TOTAL_DICES) {
        return;
    }
    const remainingDice = TOTAL_DICES - alreadyThrown;
    for (const wurf of getAllThrows(remainingDice)) {
        let fehlWurf = true;
        for (let d = 0; d < 6; d++) {
            if (state.thrown[d] == 0 && wurf[d] > 0) {
                const newThrown = [...state.thrown];
                newThrown[d] = wurf[d];
                fehlWurf = false;
                yield {...state, thrown: newThrown}
            }
        }
        if (fehlWurf) {
            yield {...state, fehlWurf: true};
        }
    }
    return;
}

console.log('next: ', getNextThrow({diceCount: [0, 0, 0, 0, 0, 1]}));
console.log('next: ', getNextThrow({diceCount: [0, 0, 0, 0, 0, 2]}));
console.log('next: ', getNextThrow({diceCount: [0, 0, 0, 0, 2, 1]}));
console.log('next: ', getNextThrow({diceCount: [0, 0, 0, 0, 2, 0]}));

/*let i = 0;
for (const wurf of getAllThrows(3)) {
    console.log('wurf: ', i++, wurf);
}*/

