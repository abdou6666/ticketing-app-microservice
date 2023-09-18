import { CustomError } from "./custom-error";


export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(public message: string) {
        console.log(message);
        super(message);

        Object.setPrototypeOf(this, BadRequestError);
    }

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        console.log(this.message);
        return [{ message: this.message }];
    }
}