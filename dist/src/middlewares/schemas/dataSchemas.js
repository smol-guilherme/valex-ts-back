import Joi from "joi";
export var cardType = Joi.object({
    workerId: Joi.number().required(),
    type: Joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
});
export var companyId = Joi.object({
    id: Joi.number().required()
});
export var cardHistory = Joi.object({
    cardId: Joi.number().required()
});
export var workerCard = Joi.object({
    cardId: Joi.number().required(),
    CVV: Joi.string().pattern(/[0-9]{3}/).required(),
    password: Joi.string().pattern(/[0-9]{4}/).required(),
    repeatPassword: Joi.ref('password')
});
export var cardLoad = Joi.object({
    cardId: Joi.number().required(),
    amount: Joi.number().min(1)
});
export var cardBlock = Joi.object({
    cardId: Joi.number().required(),
    password: Joi.string().pattern(/[0-9]{4}/).required()
});
export var payments = Joi.object({
    cardId: Joi.number().required(),
    password: Joi.string().pattern(/[0-9]{4}/).required(),
    businessId: Joi.number().required(),
    amount: Joi.number().min(1)
});
export var onlinePayments = Joi.object({
    cardId: Joi.number().required(),
    cardholderName: Joi.string().pattern(/[A-Z]{1,}\W[A-Z]+\W[A-Z]{1,}/).required(),
    number: Joi.string().pattern(/[0-9]{4}-{1}[0-9]{4}-{1}[0-9]{4}-{1}[0-9]{4}/).required(),
    CVV: Joi.string().pattern(/[0-9]{3}/).required(),
    password: Joi.string().pattern(/[0-9]{4}/).required(),
    businessId: Joi.number().required(),
    amount: Joi.number().min(1)
});
