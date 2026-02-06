import { Schema, model, models, Document, Types } from 'mongoose';
import connectToDatabase from '../lib/mongodb';
import Event from './Event';

// Ensure there's an active DB connection before defining models.
await connectToDatabase();

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322-like email validation
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook to ensure referenced Event exists before creating a booking.
// Use async middleware without `next` — throw on validation failure.
BookingSchema.pre('save', async function () {
  const booking = this as IBooking;

  if (booking.isModified('eventId') || booking.isNew) {
    try {
      const eventExists = await Event.findById(booking.eventId).select('_id');
      if (!eventExists) {
        const error = new Error(`Event with ID ${booking.eventId} does not exist`);
        error.name = 'ValidationError';
        throw error;
      }
    } catch (err) {
      const validationError = new Error('Invalid event ID format or database error');
      validationError.name = 'ValidationError';
      throw validationError;
    }
  }
});

// Indexes to improve query performance and enforce uniqueness per event/email
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
