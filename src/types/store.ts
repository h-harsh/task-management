interface BaseState {
    loading: boolean;
    error: string | null;
}

interface SuccessState<T> extends BaseState {
    status: "success";
    data: T;
}

interface IdleState extends BaseState {
    status: "idle";
    data: null;
}

interface LoadingState extends BaseState {
    status: "loading";
    data: null;
}

interface ErrorState extends BaseState {
    status: "error";
    data: null;
}

export type APIState<T> = SuccessState<T> | IdleState | LoadingState | ErrorState;
