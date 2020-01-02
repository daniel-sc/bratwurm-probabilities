import {getAllThrows, probabilityOf} from './throw';
import {fraction} from 'mathjs';

describe('throw', () => {

    describe('probabilityOf', () => {
        it('should compute correct probs for 1 dice', () => {
            expect(probabilityOf([1, 1])).toBeCloseTo(1 / 18);
            expect(probabilityOf([2, 0])).toBeCloseTo(1 / 36);
        });
    });

    describe('getAllThrows', () => {
        it('should return correct value for 0 dice count', () => {
            expect([...getAllThrows(0)]).toEqual([{diceCount: [0, 0, 0, 0, 0, 0], probability: fraction(0)}]);
        });
    });

});
