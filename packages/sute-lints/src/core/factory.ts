

abstract class Factory {

  constructor() {
  }
  abstract getConfig(): void;
  abstract getIgnoreConfig(): void
  abstract init(): void
}

export default Factory