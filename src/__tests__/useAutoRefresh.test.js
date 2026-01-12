import { renderHook, act } from '@testing-library/react-hooks';
import useAutoRefresh from '../hooks/useAutoRefresh';

jest.useFakeTimers();

describe('useAutoRefresh', () => {
  it('calls refetchFn immediately and on interval', async () => {
    const refetch = jest.fn(() => Promise.resolve());

    renderHook(() => useAutoRefresh(refetch, 1000));

    // Immediately called
    expect(refetch).toHaveBeenCalledTimes(1);

    // Advance timers by one interval
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(refetch).toHaveBeenCalledTimes(2);
  });

  it('calls refetch when document becomes visible', async () => {
    const refetch = jest.fn(() => Promise.resolve());

    renderHook(() => useAutoRefresh(refetch, 10000));

    expect(refetch).toHaveBeenCalledTimes(1);

    // Simulate visibility change
    act(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));

      Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(refetch).toHaveBeenCalledTimes(2);
  });
});
