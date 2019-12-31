import {probabilityOfFehlwurf} from './bratwurmFunctions';

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
    })
});
