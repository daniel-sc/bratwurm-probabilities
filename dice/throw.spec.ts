import {probabilityOf} from './throw';

describe('throw', () => {

    describe('probabilityOf', () => {
        it('should compute correct probs for 1 dice', () => {
            expect(probabilityOf([1, 1])).toBeCloseTo(1 / 36);
            expect(probabilityOf([2, 0])).toBeCloseTo(1 / 118);
        });
    });

});
