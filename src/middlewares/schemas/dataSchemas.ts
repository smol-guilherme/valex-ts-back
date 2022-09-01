import Joi from "joi";

export const cardType = Joi.object({
    workerId: Joi.number().required(),
    type: Joi.string().valid('groceries', 'restaurants', 'transport', 'education', 'health').required()
})

export const companyId = Joi.object({
    id: Joi.number().required()
})

export const workerCard = Joi.object({
    cardId: Joi.number(),
    CVV: Joi.string().pattern(/[0-9]{3}/).required(),
    password: Joi.string().pattern(/[0-9]{4}/).required(),
    repeatPassword: Joi.ref('password')
})