export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;
export const AVATAR_SIZE = 40;
export const MOVE_SPEED = 5;
export const PROXIMITY_RADIUS = 200;
export const MAX_VOLUME = 1.0;
export const MIN_VOLUME = 0.0;

export const AVATARS = [
  '😀', '😎', '🤓', '😊', '🥳', '🤖', '👽', '🦄',
  '🐶', '🐱', '🦊', '🐼', '🐨', '🦁', '🐯', '🐸'
];

export const SOCKET_EVENTS = {
  USER_JOINED: 'user:joined',
  USER_LEFT: 'user:left',
  USER_MOVED: 'user:moved',
  USERS_UPDATE: 'users:update',
  MESSAGE_SENT: 'message:sent',
  SIGNAL: 'signal',
  SCREEN_SHARE_START: 'screen:share:start',
  SCREEN_SHARE_STOP: 'screen:share:stop',
} as const;

