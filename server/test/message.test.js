const expect = require('expect');
const { generateMessage } = require('../../utils/message');

describe('generateMessage', () => {
    it('Generates message Object', ()=>{
        const from = 'Jen';
        const text = '';
        const message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            ...message,
            from,
            text,
        });
    });
});