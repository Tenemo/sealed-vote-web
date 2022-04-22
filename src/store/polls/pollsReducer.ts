import {
    PollsState,
    PollsActionTypes,
    Poll,
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

export const initialPollsState: PollsState = {
    createPoll: {
        isLoading: false,
        error: null,
        response: null,
    },
    polls: {},
};

const initialPoll: Poll = {
    isLoading: false,
    error: null,
    response: null,
    vote: {
        isLoading: false,
        error: null,
        response: null,
    },
};

export const pollsReducer = (
    state = initialPollsState,
    action: PollsActionTypes,
): PollsState => {
    switch (action.type) {
        case POLLS_CREATE_POLL_REQUEST:
            return {
                ...state,
                createPoll: {
                    ...state.createPoll,
                    isLoading: true,
                    error: null,
                },
            };
        case POLLS_CREATE_POLL_FAILURE:
            return {
                ...state,
                createPoll: {
                    ...state.createPoll,
                    isLoading: false,
                    error: action.payload.error,
                    response: null,
                },
            };
        case POLLS_CREATE_POLL_SUCCESS:
            return {
                ...state,
                createPoll: {
                    ...state.createPoll,
                    isLoading: false,
                    error: null,
                    response: action.payload.response,
                },
            };
        case POLLS_POLL_REQUEST: {
            if (!state.polls[action.payload.pollId]) {
                return {
                    ...state,
                    polls: {
                        ...state.polls,
                        [action.payload.pollId]: {
                            ...initialPoll,
                            isLoading: true,
                            error: null,
                        },
                    },
                };
            }
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [action.payload.pollId]: {
                        ...state.polls[action.payload.pollId],
                        isLoading: true,
                        error: null,
                    },
                },
            };
        }
        case POLLS_CREATE_POLL_CLEAR:
            return {
                ...state,
                createPoll: initialPollsState.createPoll,
            };

        case POLLS_POLL_FAILURE:
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [action.payload.pollId]: {
                        ...state.polls[action.payload.pollId],
                        isLoading: false,
                        error: action.payload.error,
                    },
                },
            };
        case POLLS_POLL_SUCCESS:
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [action.payload.pollId]: {
                        ...state.polls[action.payload.pollId],
                        isLoading: false,
                        error: null,
                        response: action.payload.response,
                    },
                },
            };

        case POLLS_VOTE_REQUEST:
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [action.payload.pollId]: {
                        ...state.polls[action.payload.pollId],
                        vote: {
                            ...state.polls[action.payload.pollId].vote,
                            isLoading: true,
                            error: null,
                        },
                    },
                },
            };
        case POLLS_VOTE_FAILURE:
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [action.payload.pollId]: {
                        ...state.polls[action.payload.pollId],
                        vote: {
                            ...state.polls[action.payload.pollId].vote,
                            isLoading: false,
                            error: action.payload.error,
                        },
                    },
                },
            };
        case POLLS_VOTE_SUCCESS:
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [action.payload.pollId]: {
                        ...state.polls[action.payload.pollId],
                        vote: {
                            ...state.polls[action.payload.pollId].vote,
                            isLoading: false,
                            error: null,
                            response: action.payload.response,
                        },
                    },
                },
            };
        default:
            return state;
    }
};
