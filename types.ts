import React from 'react';

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
  timestamp: Date;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}