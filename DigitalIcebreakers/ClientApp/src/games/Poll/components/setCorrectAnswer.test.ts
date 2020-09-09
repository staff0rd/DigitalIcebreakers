import { setCorrectAnswer } from './setCorrectAnswer';
import { Answer } from '../types/Answer';

describe('setCorrectAnswer', () => {
    describe('single toggle from true', () => {
        it('should set false', () => {
            const answers = [ { id: '0', text: '', correct: true }];
            const result = setCorrectAnswer(answers, answers[0]);
            expect(result[0].correct).toBe(false);
        });
    });
    describe('single toggle from false', () => {
        it('should set true', () => {
            const answers = [ { id: '0', text: '', correct: false }];
            const result = setCorrectAnswer(answers, answers[0]);
            expect(result[0].correct).toBe(true);
        });
    });
    
    describe('multple toggle from true', () => {
        let answers: Answer[];
        beforeEach(() => {
            answers = [ { id: '0', text: '', correct: true }, { id: '1', text: '', correct: false }];
        });
        it('should set false', () => {

        });
    });
});