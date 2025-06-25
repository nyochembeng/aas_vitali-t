import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Settings extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: [true, 'User ID is required'],
    unique: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: {
      mode: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'light',
      },
    },
    default: { mode: 'light' },
  })
  themePreferences: {
    mode: 'light' | 'dark' | 'system';
  };

  @Prop({
    type: {
      monitoringAlerts: { type: Boolean, default: true },
      dailyHealthTips: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
      symptomReminders: { type: Boolean, default: true },
    },
    default: {
      monitoringAlerts: true,
      dailyHealthTips: true,
      weeklyReports: true,
      symptomReminders: true,
    },
  })
  notificationPreferences: {
    monitoringAlerts: boolean;
    dailyHealthTips: boolean;
    weeklyReports: boolean;
    symptomReminders: boolean;
  };

  @Prop({
    type: {
      alertSensitivity: {
        type: String,
        enum: ['standard', 'sensitive'],
        default: 'standard',
      },
      notificationFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily',
      },
      reminderNotifications: { type: Boolean, default: true },
      healthEducationUpdates: { type: Boolean, default: true },
      insightsFromDataTrends: { type: Boolean, default: true },
    },
    default: {
      alertSensitivity: 'standard',
      notificationFrequency: 'daily',
      reminderNotifications: true,
      healthEducationUpdates: true,
      insightsFromDataTrends: true,
    },
  })
  monitoringPreferences: {
    alertSensitivity: 'standard' | 'sensitive';
    notificationFrequency: 'daily' | 'weekly' | 'monthly';
    reminderNotifications: boolean;
    healthEducationUpdates: boolean;
    insightsFromDataTrends: boolean;
  };

  @Prop({
    type: String,
    required: [true, 'Language is required'],
    minlength: [2, 'Language code must be at least 2 characters'],
    default: 'en',
  })
  language: string;

  @Prop({
    type: {
      analytics: { type: Boolean, default: true },
      research: { type: Boolean, default: false },
    },
    default: { analytics: true, research: false },
  })
  dataSharing: {
    analytics: boolean;
    research: boolean;
  };

  @Prop({
    type: String,
    required: false,
  })
  lastUpdated?: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
