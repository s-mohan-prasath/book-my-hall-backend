import joi from "joi"

const venueTypes = {
    HALL:"hall",
    LAB : "lab",
    CLASSROOM : "classroom",
    AUDITORIUM : "auditorium"
}
export const ValidateAddVenue = (venueData) => {
    const Schema = joi.object({
        name: joi.string().required().min(3).max(50),
        type:joi.required().valid(...Object.values(venueTypes)),
        seating_capacity:joi.number().min(1).max(10000).required(),
        has_projector:joi.bool(),
        has_ac:joi.bool(),
        has_podium:joi.bool(),
        address:joi.string().required()
    })
    return Schema.validateAsync(venueData)
}
export const ValidateUpdateVenue = (venueData) => {
    const Schema = joi.object({
        name: joi.string().min(3).max(50),
        type:joi.valid(...Object.values(venueTypes)),
        seating_capacity:joi.number().min(1).max(10000),
        has_projector:joi.bool(),
        has_ac:joi.bool(),
        has_podium:joi.bool(),
        address:joi.string()
    })
    return Schema.validateAsync(venueData)
}