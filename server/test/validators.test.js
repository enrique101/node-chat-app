const expect = require('expect');
const { isValidString } = require('../utils/validators');

describe('isValidString', ()=>{
    it('rejects non-string values', ()=>{
        const res =  isValidString(89);
        expect(res).toBe(false);
    });
    it('rejects spaces values', ()=>{
        const res =  isValidString('    ');
        expect(res).toBe(false);
    });

    it('accepts valid string values', ()=>{
        const res =  isValidString('   lalal    ');
        expect(res).toBe(true);
    });
});