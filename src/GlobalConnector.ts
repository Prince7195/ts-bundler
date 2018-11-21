declare var Rx: any;
export namespace Store {
  class GlobalConnector implements IGlobalConnector {
    private subject = new Rx.BehaviorSubject({});

    dispatch(action: IAction) {
      this.subject.next(action);
    }

    listen(callback: IGConnectorCallback) {
      this.subject.subscribe(callback);
    }
  }

  export const GlobalListener = new GlobalConnector();
}

interface IAction {
  type: string;
  payload?: any;
  meta?: any;
}

type IGConnectorCallback = (action: IAction) => void;

interface IGlobalConnector {
  dispatch: (action: IAction) => void;
  listen: (callback: IGConnectorCallback) => void;
}