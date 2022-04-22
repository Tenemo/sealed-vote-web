export type RequestError = {
    statusCode: number;
    error: string;
    message: string;
};

export type UnknownError = RequestError | Error;
