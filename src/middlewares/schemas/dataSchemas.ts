import Joi from "joi";

export const cardType = Joi.object({
    workerId: Joi.number().required(),
    type: Joi.string().valid(['groceries', 'restaurants', 'transport', 'education', 'health']).required()
})

export const companyId = Joi.object({
    id: Joi.number().required()
})