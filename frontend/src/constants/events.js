/**
 * constants/events.js
 *
 * Centralized event name registry for custom DOM events dispatched throughout the application.
 * This file serves as the single source of truth for event names, preventing typos and making
 * events discoverable across the codebase.
 *
 * Naming Convention: FEATURE_ACTION
 * - FEATURE: The domain/component triggering the event (e.g., USER, NAVIGATION, HOLD)
 * - ACTION: The past-tense action that occurred (e.g., LOGIN_ATTEMPT, CHANGED, STATUS_CHANGED)
 * - Format: UPPER_SNAKE_CASE
 *
 * Usage:
 *   import { EVENTS } from './constants/events';
 *   document.dispatchEvent(new CustomEvent(EVENTS.USER_LOGIN_ATTEMPT, { detail: {...} }));
 */

export const EVENTS = {
  /**
   * USER_LOGIN_ATTEMPT
   * Fired when user submits login credentials via the login modal
   * Payload: { credential: string, password: string }
   * - credential: email address or phone number
   * - password: user-entered password
   * Fired by: LoginModal component
   * Listened by: App.jsx (for validation and authentication)
   */
  USER_LOGIN_ATTEMPT: 'userLoginAttempt',

  /**
   * NAVIGATION_CHANGED
   * Fired when user selects a menu option in the navigation bar
   * Payload: { view: string }
   * - view: one of ['home', 'orders', 'history', 'account']
   * Fired by: MenuBar component
   * Listened by: App.jsx (to switch active view/content)
   */
  NAVIGATION_CHANGED: 'navigationChanged',

  /**
   * HOLD_PICKUP_STATUS_CHANGED
   * Fired when user toggles the pickup status of a hold item
   * Payload: { holdId: string, isPickedUp: boolean }
   * - holdId: unique identifier for the hold item
   * - isPickedUp: true when marking as picked up, false when unmarking
   * Fired by: PickupCard component
   * Listened by: App.jsx (to update backend and local state)
   */
  HOLD_PICKUP_STATUS_CHANGED: 'holdPickupStatusChanged',
};
