import { currentQuestionSelector, importQuestionsAction } from './PollReducer';
import { rootReducer } from '../../store/rootReducer'
import { configureStore } from '@reduxjs/toolkit';

describe('PollReducer', () =>{
    let store = configureStore({ reducer: rootReducer });

    beforeEach(() => {
        store = configureStore({ reducer: rootReducer });
    })

    describe('import questions', () => {
        it('should reset current question', () => {
            store.dispatch(importQuestionsAction([{id: '1', text: 'a question', responses: [], answers: []}]))
            const currentQuestion = currentQuestionSelector(store.getState());
            expect(currentQuestion.currentQuestionId).toBe('1');
            expect(currentQuestion.question?.text).toBe('a question');
        });
        it('should clear current question', () => {
            store.dispatch(importQuestionsAction([]))
            const currentQuestion = currentQuestionSelector(store.getState());
            expect(currentQuestion.currentQuestionId).toBeUndefined();
        });
    })
});