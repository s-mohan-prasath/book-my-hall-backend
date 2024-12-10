import joi from 'joi'

let bookingStatus = {
    ACCEPTED: 'accepted', DECLINED: "declined", PENDING: "pending", CANCELLED: "cancelled"
}
export function ValidateNewBooking(bookingData) {
    const Schema = joi.object({
        venue: joi.string().required(),
        event_name: joi.string().required().max(100),
        event_desc: joi.string().required().max(500),
        event_start: joi.date().required(),
        event_end: joi.date().required(),
        event_image: joi.string(),
        request_note: joi.string(),
        people_count: joi.number().min(1).max(10000).required()
    })
    return Schema.validateAsync(bookingData)
}
export function ValidateUpdateBooking(bookingData) {
    const Schema = joi.object({
        event_name: joi.string().max(100),
        event_desc: joi.string().max(500),
        event_start: joi.date().required(),
        event_end: joi.date().required(),
        event_image: joi.string(),
        request_note: joi.string(),
        people_count: joi.number().min(1).max(10000)
    })
    return Schema.validateAsync(bookingData)
}
export function ValidateAdminUpdateBooking(bookingData) {
    const Schema = joi.object({
        venue: joi.string(),
        event_name: joi.string().max(100),
        event_desc: joi.string().max(500),
        event_start: joi.date(),
        event_end: joi.date(),
        event_image: joi.string(),
        request_note: joi.string(),
        status: joi.string().valid(...Object.values(bookingStatus)),
        people_count: joi.number().min(1).max(10000)
    })
    return Schema.validateAsync(bookingData)
}