import { UnknownError, RequestError } from 'typings/errors';

export const transformError = (error: UnknownError): UnknownError => {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    if (!error) {
        return error;
    }
    // @ts-ignore
    if (error.response?.data) {
        // @ts-ignore
        return error.response?.data as RequestError;
    }
    return error;
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    /* eslint-enable @typescript-eslint/ban-ts-comment */
};
