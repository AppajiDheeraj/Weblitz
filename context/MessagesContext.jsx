import { createContext } from 'react';
// This context is used to manage messages in the application
// It can be used to store and retrieve messages for various components
// such as notifications, alerts, or any other message-related functionality
// The context can be consumed by components to access the messages and update them as needed
export const MessagesContext = createContext();