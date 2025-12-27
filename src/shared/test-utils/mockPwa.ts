export const mockNeedRefresh = { value: false };

export function useRegisterSW(opts?: any) {
  void opts;
  return {
    get needRefresh() {
      return mockNeedRefresh.value;
    },
    updateServiceWorker: () => {},
  };
}
