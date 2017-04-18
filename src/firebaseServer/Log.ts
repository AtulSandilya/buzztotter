/* tslint:disable:no-console */
class Log {
  public static StartQueueMessage = (url: string) => {
    console.log("Listening for changes on node: ", url);
  }

  private start: number;
  private action: string;

  constructor(action) {
    this.action = action;
    this.start = this.getUnixTime();
  }

  public successMessage = () => {
    console.log(`Successfully completed ${this.action} in ${this.getTimeElapsed()} ms`);
  }

  public failMessage = (error: Error) => {
    console.log(`Failed ${this.action} in ${this.getTimeElapsed()} ms`);
    console.log(`Error for ${this.action}: ${error}`);
  }

  private getUnixTime = (): number => {
    return Date.now();
  }

  private getTimeElapsed = () => {
    return this.getUnixTime() - this.start;
  }
}

export default Log;
