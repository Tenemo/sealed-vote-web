import { createSelector } from 'reselect';

import { RootState } from 'store/types';
import { PollsState, Poll } from 'store/polls/pollsTypes';

export const getPolls = (state: RootState): PollsState => state.polls;
export const getPollsCreatePoll = createSelector(
    getPolls,
    (polls) => polls.createPoll,
);
export const makeGetPoll = (pollId: string): ((state: RootState) => Poll) =>
    createSelector(getPolls, (polls) => polls.polls[pollId]);
