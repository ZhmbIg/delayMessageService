export interface MessageCreatedEvent {
  messageId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface MessageScheduledEvent {
  messageId: string;
  userId: string;
  scheduleTime: Date;
}