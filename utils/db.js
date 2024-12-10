import { BookingModel } from './../models/allModels.js'
export async function isBookingAvailable(venue, event_start, event_end) {
  const overlappingBookings = await BookingModel.find({
    venue,
    $or: [
      { event_start: { $lt: event_end }, event_end: { $gt: event_start } }
    ]
  });
  return overlappingBookings.length;
}
