declare module "redux-mock-store" {
  import { Store, AnyAction, Middleware } from "redux";
  export interface MockStoreEnhanced<
    S = unknown,
    A extends AnyAction = AnyAction
  > extends Store<S, A> {
    getActions(): A[];
    clearActions(): void;
    subscribe(): () => void;
    replaceReducer(nextReducer: unknown): void;
  }
  export default function configureMockStore<
    S = unknown,
    A extends AnyAction = AnyAction
  >(middlewares?: Middleware[]): (initialState?: S) => MockStoreEnhanced<S, A>;
}
