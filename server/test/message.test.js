const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('../utils/message');

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

describe('generateLocationMessage', () => {
    it('Generates location message Object', ()=>{
        const from = 'User';
        const longitude = '123';
        const latitude = '456';
        const message = generateLocationMessage(from,latitude,longitude);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from,
            url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        });
    });
});