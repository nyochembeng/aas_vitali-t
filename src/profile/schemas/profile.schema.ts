import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Profile extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: [true, 'User ID is required'],
    unique: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Date,
    required: [true, 'Date of birth is required'],
  })
  dateOfBirth: Date;

  @Prop({
    type: String,
    required: false,
  })
  height?: string;

  @Prop({
    type: String,
    enum: ['cm', 'ft'],
    required: [true, 'Height unit is required'],
    default: 'cm',
  })
  heightUnit: 'cm' | 'ft';

  @Prop({
    type: String,
    required: false,
  })
  weight?: string;

  @Prop({
    type: String,
    enum: ['kg', 'lbs'],
    required: [true, 'Weight unit is required'],
    default: 'kg',
  })
  weightUnit: 'kg' | 'lbs';

  @Prop({
    type: String,
    required: [true, 'Phone number is required'],
    minlength: [7, 'Phone number must be at least 7 digits'],
    maxlength: [15, 'Phone number must not exceed 15 digits'],
    match: [/^\d+$/, 'Phone number must contain only digits'],
  })
  phoneNumber: string;

  @Prop({
    type: String,
    required: [true, 'Country code is required'],
    match: [/^\+\d{1,4}$/, 'Invalid country code'],
  })
  countryCode: string;

  @Prop({
    type: Date,
    required: [true, 'Conceived date is required'],
  })
  conceivedDate: Date;

  @Prop({
    type: Date,
    required: false,
  })
  dueDate?: Date;

  @Prop({
    type: String,
    required: false,
  })
  profileImage?: string;

  @Prop({
    type: {
      name: { type: String, required: true },
      phoneNumber: {
        type: String,
        required: true,
        minlength: [7, 'Doctor phone number must be at least 7 digits'],
        maxlength: [15, 'Doctor phone number must not exceed 15 digits'],
        match: [/^\d+$/, 'Doctor phone number must contain only digits'],
      },
      email: {
        type: String,
        required: false,
        match: [/^\S+@\S+\.\S+$/, 'Invalid doctor email address'],
        maxlength: [255, 'Doctor email must not exceed 255 characters'],
      },
    },
    required: [true, 'Doctor contact is required'],
  })
  doctorContact: {
    name: string;
    phoneNumber: string;
    email?: string;
  };

  @Prop({
    type: Map,
    of: String,
    required: false,
  })
  metadata?: Record<string, any>;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
