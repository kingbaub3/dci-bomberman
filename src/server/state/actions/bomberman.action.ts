import { Action } from "redux";
import { Bomb, PlayerId, PlayerActionWrapper } from "../../models";
import { GameAction } from "dci-game-server";

/** Contains all of the actions that can be performed in the bomberman game. */
export const JOIN_GAME = "[User] Wants to join the game";
export const GAME_JOINED = "[User] Joined the game";

export const LEAVE_GAME = "[User] Wants to leave the game";
export const GAME_LEFT = "[User] Left the game";

export const START_GAME = "[User] Wants to start the game";
export const GAME_STARTED = "[User] Game has started";

export const PAUSE_GAME = "[User] Wants to pause the game";
export const GAME_PAUSED = "[User] Game is paused";

export const RESUME_GAME = "[User] Wants to resume the game";
export const GAME_RESUMED = "[User] Game is resumed";

export const UPDATE_MOVEMENT = "[Player] Has changed the way he's moving";

// User has a bomb limit. This limit changes with collectible.
export const PLANT_BOMB = "[Player] Wants to plant a bomb";
export const BOMB_PLANTED = "[Player] Planted a bomb";
export const BOMB_EXPLODED = "[Bomb] Has exploded";

export const PLAYER_DAMAGED = "[Player] Has been hit by a bomb";
export const PLAYER_DIED = "[Player] Is dead";

export const GAME_STATE_CHANGED = "[Game] state has changed";

// Action class implementation
export class JoinGame {
  static create(payload: PlayerId): GameAction {
    return {
      type: JOIN_GAME,
      payload
    };
  }
}

export class GameJoined {
  static create(): GameAction {
    return {
      type: GAME_JOINED
    };
  }
}

export class LeaveGame {
  static create(payload: PlayerId): GameAction {
    return {
      type: LEAVE_GAME,
      payload
    };
  }
}

export class GameLeft {
  static create(payload: PlayerId): GameAction {
    return {
      type: GAME_LEFT,
      payload
    };
  }
}

export class PauseGame {
  static create(): GameAction {
    return {
      type: PAUSE_GAME
    };
  }
}

export class GamePaused {
  static create(): GameAction {
    return {
      type: GAME_PAUSED
    };
  }
}

export class StartGame {
  static create(): GameAction {
    return {
      type: START_GAME
    };
  }
}

export class GameStarted {
  static create(): GameAction {
    return {
      type: GAME_STARTED
    };
  }
}

export class ResumeGame {
  static create(): GameAction {
    return {
      type: RESUME_GAME
    };
  }
}

export class GameResumed {
  static create(): GameAction {
    return {
      type: GAME_RESUMED
    };
  }
}

export class UpdateMouvement {
  static create(payload: PlayerActionWrapper): GameAction {
    return {
      type: UPDATE_MOVEMENT,
      payload
    };
  }
}

export class PlantBomb {
  static create(payload: PlayerId): GameAction {
    return {
      type: PLANT_BOMB,
      payload
    };
  }
}

export class BombPlanted {
  static create(payload: Bomb): GameAction {
    return {
      type: BOMB_PLANTED,
      payload
    };
  }
}

export class BombExploded {
  static create(payload: Bomb): GameAction {
    return {
      type: BOMB_EXPLODED,
      payload
    };
  }
}

export class PlayerDamaged {
  static create(payload: PlayerId): GameAction {
    return {
      type: PLAYER_DAMAGED,
      payload
    };
  }
}

export class PlayerDied {
  static create(payload: PlayerId): GameAction {
    return {
      type: PLAYER_DIED,
      payload
    };
  }
}

export class GameStateChanged {
  static create(): GameAction {
    return {
      type: GAME_STATE_CHANGED
    };
  }
}

export type BombermanAction =
  | JoinGame
  | GameJoined
  | LeaveGame
  | GameLeft
  | PauseGame
  | GamePaused
  | StartGame
  | GameStarted
  | ResumeGame
  | GameResumed
  | UpdateMouvement
  | PlantBomb
  | BombPlanted
  | BombExploded
  | PlayerDamaged
  | PlayerDied
  | GameStateChanged;
