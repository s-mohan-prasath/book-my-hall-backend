import joi from "joi"

export const ValidateSignUp = (userData) => {
    const Schema = joi.object({
        name: joi.string().required().min(3),
        email: joi.string().required().email().pattern(new RegExp("^([a-zA-Z0-9._-]+)@psgtech\.ac\.in$")),
        password: joi.string().required().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{8,15}$")),
        phoneNumber: joi.string().required().length(10)

    })
    return Schema.validateAsync(userData)
}
export const ValidateSignIn = (userData) => {
    const Schema = joi.object({
        email: joi.string().required().email().pattern(new RegExp("^([a-zA-Z0-9._-]+)@psgtech\.ac\.in$")),
        password: joi.string().required().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{8,15}$")),
    })
    return Schema.validateAsync(userData)
}
export const ValidateAdminSignIn = (adminUserData) => {
    const Schema = joi.object({
        email: joi.string().required().email().pattern(new RegExp("^([a-zA-Z0-9._-]+)@psgtech\.ac\.in$")),
        password: joi.string().required().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{8,15}$")),
    })
    return Schema.validateAsync(adminUserData)
}