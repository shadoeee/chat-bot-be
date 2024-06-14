import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult, body } from "express-validator";

const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
            }
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(422).json({ errors: errors.array() });
    }
}

const loginValidator: ValidationChain[] = [
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password").trim().isLength({ min: 6 }).withMessage("Password should contain at least 6 characters"),
];

const signupValidator: ValidationChain[] = [
    body("name").notEmpty().withMessage("Name is required"),
    ...loginValidator,
];

const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Message is required"),

];

export { validate, signupValidator, loginValidator, chatCompletionValidator };
