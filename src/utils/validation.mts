import Joi from "joi"

const validator = (schema : any) : any => {
    return (payload : any) => {
        if (!payload) {
            return { error: "input is undefined"}
        }

        return schema.validate(payload, {abortEarly : false})
    }
}

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(8).max(30).required()
})

export const validateRegister = validator(registerSchema)

const postExpense = Joi.object({
    amount: Joi.number().required(),
    description: Joi.string(),
    date: Joi.date().iso()
})

export const validatePostExpense = validator(postExpense);