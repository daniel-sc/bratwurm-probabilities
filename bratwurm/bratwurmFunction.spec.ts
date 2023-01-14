import {getSum, probabilityOfFehlwurf, probAtLeast, probExact} from './bratwurmFunctions';
import {string} from 'mathjs';
import {BratwurmState} from './bratwurmState';

function getState(diceCount: number[], fehlwurf = false): BratwurmState {
    return {
        thrown: {diceCount: diceCount, probability: 1},
        fehlWurf: fehlwurf
    };
}

describe('bratwurmFunctions', () => {
    describe('probabilityOfFehlwurf', () => {
        it('should compute correct prob for 1 missing dice and no bratwurm', () => {
            expect(probabilityOfFehlwurf(getState([7, 0, 0, 0, 0, 0]))).toBeCloseTo(5 / 6);
        });
        it('should compute correct prob for 1 missing dice and existing bratwurm', () => {
            expect(probabilityOfFehlwurf(getState([0, 0, 0, 0, 0, 7]))).toBeCloseTo(1 / 6);
        });
        it('should compute correct prob for 1 missing dice and 1 free slot and existing bratwurm', () => {
            expect(probabilityOfFehlwurf(getState([0, 1, 1, 1, 1, 3]))).toBeCloseTo(5 / 6);
        });
    });

    describe('getSum', () => {
        it('should compute correct sum', () => {
            expect(getSum([0, 0, 0, 0, 0, 1])).toEqual(5);
            expect(getSum([0, 0, 0, 0, 1, 0])).toEqual(5);
            expect(getSum([0, 0, 0, 1, 0, 0])).toEqual(4);
            expect(getSum([0, 0, 0, 1, 1, 1])).toEqual(14);
        });
    });

    describe('probExact', () => {
        it('should return 0 for too high sum', () => {
            expect(string(probExact(21, getState([0, 0, 0, 0, 0, 5])))).toEqual('0');
            expect(string(probExact(21, getState([0, 0, 0, 0, 5, 0])))).toEqual('0');
        });
        it('should return 0 for fehlwurf', () => {
            expect(string(probExact(21, getState([0, 0, 0, 0, 0, 1], true)))).toEqual('0');
            expect(string(probExact(21, getState([0, 0, 0, 0, 1, 0], true)))).toEqual('0');
        });
        it('should return 0 if all dice used', () => {
            expect(string(probExact(21, getState([7, 0, 0, 0, 0, 1])))).toEqual('0');
            expect(string(probExact(21, getState([7, 0, 0, 0, 1, 0])))).toEqual('0');
        });
        it('should return 1 if sum matches and contains bratwurm', () => {
            expect(string(probExact(21, getState([1, 0, 0, 0, 0, 4])))).toEqual('1');
        });
        it('should return 0 if sum matches but does not contain bratwurm', () => {
            expect(string(probExact(21, getState([1, 0, 0, 0, 4, 0])))).toEqual('0');
        });
        // https://www.omnicalculator.com/statistics/dice?v=dice_type:6,target_value2:0,target_value3:0,number_of_dice:3,game_option:4.000000000000000,target_value1:1,target_dice:1
        it('should return correct simple recursive value', () => {
            expect(probExact(21, getState([0, 0, 0, 0, 0, 4]))).toBeCloseTo(0.3858025);
        });
        it('should return correct recursive value', () => {
            console.debug = () => null;
            expect(probExact(21, getState([0, 0, 0, 0, 0, 0]))).toBeCloseTo(0.439596789623015);
        });
    });

    describe('probAtLeast', () => {
        it('should return 1 for too high sum if bratwurm is contained', () => {
            expect(string(probAtLeast(21, getState([0, 0, 0, 0, 0, 5])))).toEqual('1');
        });
        it('should return < 1 for too high sum if bratwurm is not contained', () => {
            expect(probAtLeast(21, getState([0, 0, 0, 0, 7, 0]))).toBeCloseTo(1/6);
        });
        it('should return 0 if all dice used', () => {
            expect(string(probAtLeast(21, getState([7, 0, 0, 0, 0, 1])))).toEqual('0');
            expect(string(probAtLeast(21, getState([7, 0, 0, 0, 1, 0])))).toEqual('0');
        });
        it('should return 1 if sum matches and bratwurm contained', () => {
            expect(string(probAtLeast(21, getState([1, 0, 0, 0, 0, 4])))).toEqual('1');
        });
        it('should return < 1 if sum matches and bratwurm not contained', () => {
            expect(probAtLeast(21, getState([1, 0, 0, 0, 4, 0]))).toBeLessThan(1);
        });
        it('should return correct simple recursive value', () => {
            expect(probAtLeast(21, getState([0, 0, 0, 0, 0, 4]))).toBeCloseTo(0.9992);
        });
        it('should return correct recursive value', () => {
            console.debug = () => null;
            expect(probAtLeast(21, getState([0, 0, 0, 0, 0, 0]))).toBeCloseTo(0.893026737150746);
        });
    });
});
