export interface UserCreatedEvent {
  id: string;
  email: string;
  role: string;
  timestamp: Date;
}

export interface UserUpdatedEvent {
  id: string;
  changes: Record<string, any>;
  timestamp: Date;
}