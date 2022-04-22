import { UnknownError } from 'typings/errors';

export const POLLS_CREATE_POLL_REQUEST = 'POLLS_CREATE_POLL_REQUEST';
export const POLLS_CREATE_POLL_FAILURE = 'POLLS_CREATE_POLL_FAILURE';
export const POLLS_CREATE_POLL_SUCCESS = 'POLLS_CREATE_POLL_SUCCESS';
export const POLLS_CREATE_POLL_CLEAR = 'POLLS_CREATE_POLL_CLEAR';

export const POLLS_POLL_REQUEST = 'POLLS_POLL_REQUEST';
export const POLLS_POLL_FAILURE = 'POLLS_POLL_FAILURE';
export const POLLS_POLL_SUCCESS = 'POLLS_POLL_SUCCESS';

export const POLLS_VOTE_REQUEST = 'POLLS_VOTE_REQUEST';
export const POLLS_VOTE_FAILURE = 'POLLS_VOTE_FAILURE';
export const POLLS_VOTE_SUCCESS = 'POLLS_VOTE_SUCCESS';

export type CreatePollResponse = {
    pollName: string;
    creatorToken: string;
    choices: string[];
    maxParticipants: number;
    id: string;
    createdAt: string;
};

export type PollResponse = {
    pollName: string;
    createdAt: string;
    voters: string[];
    choices: string[];
    results?: Record<string, number>;
};

export type VoteResponse = string;

export type Poll = {
    isLoading: boolean;
    error: UnknownError | null;
    response: PollResponse | null;
    vote: {
        isLoading: boolean;
        error: UnknownError | null;
        response: VoteResponse | null;
    };
};

export type PollsState = {
    createPoll: {
        isLoading: boolean;
        error: UnknownError | null;
        response: CreatePollResponse | null;
    };
    polls: Record<string, Poll>;
};

type CreatePollRequestAction = {
    type: typeof POLLS_CREATE_POLL_REQUEST;
};
type CreatePollFailureAction = {
    type: typeof POLLS_CREATE_POLL_FAILURE;
    payload: {
        error: UnknownError;
    };
};
type CreatePollSuccessAction = {
    type: typeof POLLS_CREATE_POLL_SUCCESS;
    payload: {
        response: CreatePollResponse;
    };
};
type CreatePollClearAction = {
    type: typeof POLLS_CREATE_POLL_CLEAR;
};

type PollRequestAction = {
    type: typeof POLLS_POLL_REQUEST;
    payload: {
        pollId: string;
    };
};
type PollFailureAction = {
    type: typeof POLLS_POLL_FAILURE;
    payload: {
        pollId: string;
        error: UnknownError;
    };
};
type PollSuccessAction = {
    type: typeof POLLS_POLL_SUCCESS;
    payload: {
        pollId: string;
        response: PollResponse;
    };
};

type VoteRequestAction = {
    type: typeof POLLS_VOTE_REQUEST;
    payload: {
        pollId: string;
    };
};
type VoteFailureAction = {
    type: typeof POLLS_VOTE_FAILURE;
    payload: {
        pollId: string;
        error: UnknownError;
    };
};
type VoteSuccessAction = {
    type: typeof POLLS_VOTE_SUCCESS;
    payload: {
        pollId: string;
        response: VoteResponse;
    };
};

export type PollsActionTypes =
    | CreatePollRequestAction
    | CreatePollFailureAction
    | CreatePollSuccessAction
    | CreatePollClearAction
    | PollRequestAction
    | PollFailureAction
    | PollSuccessAction
    | VoteRequestAction
    | VoteFailureAction
    | VoteSuccessAction;
