import { v4 as uuid } from 'uuid';

import {
    PollsActionTypes,
    CreatePollResponse,
    PollResponse,
    VoteResponse,
    POLLS_CREATE_POLL_REQUEST,
    POLLS_CREATE_POLL_FAILURE,
    POLLS_CREATE_POLL_SUCCESS,
    POLLS_CREATE_POLL_CLEAR,
    POLLS_POLL_REQUEST,
    POLLS_POLL_FAILURE,
    POLLS_POLL_SUCCESS,
    POLLS_VOTE_REQUEST,
    POLLS_VOTE_FAILURE,
    POLLS_VOTE_SUCCESS,
} from 'store/polls/pollsTypes';
import { CommonDispatch } from 'store/types';
import { UnknownError } from 'typings/errors';
import request from 'utils/request';
import { transformError } from 'utils/utils';

export const createPollRequest = (): PollsActionTypes => ({
    type: POLLS_CREATE_POLL_REQUEST,
});
export const createPollFailure = (error: UnknownError): PollsActionTypes => ({
    type: POLLS_CREATE_POLL_FAILURE,
    payload: { error: transformError(error) },
});
export const createPollSuccess = (
    response: CreatePollResponse,
): PollsActionTypes => ({
    type: POLLS_CREATE_POLL_SUCCESS,
    payload: { response },
});
export const createPoll =
    ({ choices, pollName }: { choices: string[]; pollName: string }) =>
    async (dispatch: CommonDispatch): Promise<void> => {
        try {
            dispatch(createPollRequest());
            const response = await request.post<CreatePollResponse>(
                '/api/polls/create',
                { choices, pollName },
            );
            dispatch(createPollSuccess(response.data));
        } catch (error) {
            dispatch(createPollFailure(error as UnknownError));
        }
    };
export const createPollClear = (): PollsActionTypes => ({
    type: POLLS_CREATE_POLL_CLEAR,
});

export const fetchPollRequest = (pollId: string): PollsActionTypes => ({
    type: POLLS_POLL_REQUEST,
    payload: { pollId },
});
export const fetchPollFailure = (
    pollId: string,
    error: UnknownError,
): PollsActionTypes => ({
    type: POLLS_POLL_FAILURE,
    payload: { error: transformError(error), pollId },
});
export const fetchPollSuccess = (
    pollId: string,
    response: PollResponse,
): PollsActionTypes => ({
    type: POLLS_POLL_SUCCESS,
    payload: { pollId, response },
});
export const fetchPoll =
    (pollId: string) =>
    async (dispatch: CommonDispatch): Promise<void> => {
        try {
            dispatch(fetchPollRequest(pollId));
            const response = await request.get<PollResponse>(
                `/api/polls/${pollId}`,
            );
            dispatch(fetchPollSuccess(pollId, response.data));
        } catch (error) {
            dispatch(fetchPollFailure(pollId, error as UnknownError));
        }
    };

export const voteRequest = (pollId: string): PollsActionTypes => ({
    type: POLLS_VOTE_REQUEST,
    payload: { pollId },
});
export const voteFailure = (
    pollId: string,
    error: UnknownError,
): PollsActionTypes => ({
    type: POLLS_VOTE_FAILURE,
    payload: { error: transformError(error), pollId },
});
export const voteSuccess = (
    pollId: string,
    response: VoteResponse,
): PollsActionTypes => ({
    type: POLLS_VOTE_SUCCESS,
    payload: { pollId, response },
});
export const vote =
    (pollId: string, votes: Record<string, number>, voterName?: string) =>
    async (dispatch: CommonDispatch): Promise<void> => {
        try {
            dispatch(voteRequest(pollId));
            const response = await request.post<VoteResponse>(
                `/api/polls/${pollId}/vote`,
                { votes, voterName: voterName ?? uuid() },
            );
            void dispatch(fetchPoll(pollId));
            dispatch(voteSuccess(pollId, response.data));
        } catch (error) {
            dispatch(voteFailure(pollId, error as UnknownError));
        }
    };
