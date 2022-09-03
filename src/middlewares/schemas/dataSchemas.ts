import Joi from "joi";

export const cardType = Joi.object({
    workerId: Joi.number().required(),
    type: Joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
})

export const companyId = Joi.object({
    id: Joi.number().required()
})

export const cardHistory = Joi.object({
    cardId: Joi.number().required()
})

export const workerCard = Joi.object({
    cardId: Joi.number().required(),
    CVV: Joi.string().pattern(/[0-9]{3}/).required(),
    password: Joi.string().pattern(/[0-9]{4}/).required(),
    repeatPassword: Joi.ref('password')
})

export const cardLoad = Joi.object({
    cardId: Joi.number().required(),
    amount: Joi.number().min(1),
})

export const cardBlock = Joi.object({
    cardId: Joi.number().required(),
    password: Joi.string().pattern(/[0-9]{4}/).required(),
})

export const payments = Joi.object({
    cardId: Joi.number().required(),
    password: Joi.string().pattern(/[0-9]{4}/).required(),
    businessId: Joi.number().required(),
    amount: Joi.number().min(1)
})

export const onlinePayments = Joi.object({
    cardId: Joi.number().required(),
    cardholderName: Joi.string().pattern(/[A-Z]{1,}\W[A-Z]+\W[A-Z]{1,}/).required(),
    number: Joi.string().pattern(/[0-9]{4}-{1}[0-9]{4}-{1}[0-9]{4}-{1}[0-9]{4}/).required(),
    CVV: Joi.string().pattern(/[0-9]{3}/).required(),
    password: Joi.string().pattern(/[0-9]{4}/).required(),
    businessId: Joi.number().required(),
    amount: Joi.number().min(1)
})