import {getSum, prob, probabilityOfFehlwurf} from './bratwurmFunctions';
import * as math from 'mathjs';

describe('bratwurmFunctions', () => {
    describe('probabilityOfFehlwurf', () => {
        it('should compute correct prob for 1 missing dice and no bratwurm', function () {
            expect(probabilityOfFehlwurf({
                thrown: {diceCount: [7, 0, 0, 0, 0, 0], probability: 1},
                fehlWurf: false
            })).toBeCloseTo(5 / 6);
        });
        it('should compute correct prob for 1 missing dice and existing bratwurm', function () {
            expect(probabilityOfFehlwurf({
                thrown: {diceCount: [0, 0, 0, 0, 0, 7], probability: 1},
                fehlWurf: false
            })).toBeCloseTo(1 / 6);
        });
        it('should compute correct prob for 1 missing dice and 1 free slot and existing bratwurm', function () {
            expect(probabilityOfFehlwurf({
                thrown: {diceCount: [0, 1, 1, 1, 1, 3], probability: 1},
                fehlWurf: false
            })).toBeCloseTo(5 / 6);
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

    describe('prob', () => {
        it('should return 0 for too high sum', () => {
            expect(math.string(prob(21, {
                thrown: {diceCount: [0, 0, 0, 0, 0, 5], probability: 1},
                fehlWurf: false
            }))).toEqual('0');
            expect(math.string(prob(21, {
                thrown: {diceCount: [0, 0, 0, 0, 5, 0], probability: 1},
                fehlWurf: false
            }))).toEqual('0');
        });
        it('should return 0 for fehlwurf', () => {
            expect(math.string(prob(21, {
                thrown: {diceCount: [0, 0, 0, 0, 0, 1], probability: 1},
                fehlWurf: true
            }))).toEqual('0');
            expect(math.string(prob(21, {
                thrown: {diceCount: [0, 0, 0, 0, 1, 0], probability: 1},
                fehlWurf: true
            }))).toEqual('0');
        });
        it('should return 0 if all dice used', () => {
            expect(math.string(prob(21, {
                thrown: {diceCount: [7, 0, 0, 0, 0, 1], probability: 1},
                fehlWurf: false
            }))).toEqual('0');
            expect(math.string(prob(21, {
                thrown: {diceCount: [7, 0, 0, 0, 1, 0], probability: 1},
                fehlWurf: false
            }))).toEqual('0');
        });
        it('should return 1 if sum matches', () => {
            expect(math.string(prob(21, {
                thrown: {diceCount: [1, 0, 0, 0, 0, 4], probability: 1},
                fehlWurf: false
            }))).toEqual('1');
            expect(math.string(prob(21, {
                thrown: {diceCount: [1, 0, 0, 0, 4, 0], probability: 1},
                fehlWurf: false
            }))).toEqual('1');
        });
        // https://www.omnicalculator.com/statistics/dice?v=dice_type:6,target_value2:0,target_value3:0,number_of_dice:3,game_option:4.000000000000000,target_value1:1,target_dice:1
        it('should return correct simple recursive value', () => {
            expect(prob(21, {
                thrown: {diceCount: [0, 0, 0, 0, 0, 4], probability: 1},
                fehlWurf: false
            })).toBeCloseTo(0.3858);
        });
        it('should return correct recursive value', () => {
            console.debug = () => null;
            expect(prob(21, {
                thrown: {diceCount: [0, 0, 0, 0, 0, 0], probability: 1},
                fehlWurf: false
            })).toBeCloseTo(0.4951502336);
        });
    });
});
