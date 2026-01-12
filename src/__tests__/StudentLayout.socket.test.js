import React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import StudentLayout from '../components/StudentPortal/Layout/StudentLayout';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

// Mock socket.io-client
const mockOn = jest.fn();
const mockDisconnect = jest.fn();
const handlers = {};
const mockSocket = {
  on: (event, cb) => {
    handlers[event] = cb;
    mockOn(event, cb);
  },
  disconnect: mockDisconnect
};

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => mockSocket)
}));

describe('StudentLayout socket integration', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('connects to socket and handles downloads event', async () => {
    const user = { username: 'student1' };

    const { unmount } = render(
      <AuthContext.Provider value={{ user }}>
        <StudentLayout />
      </AuthContext.Provider>
    );

    // simulate download event
    act(() => {
      handlers['downloads:created'] && handlers['downloads:created']({ title: 'Test File' });
    });

    // toast should be called and window event dispatched
    expect(toast.success).toHaveBeenCalledWith('New study material available');

    // Listener on window should receive the custom event
    const listener = jest.fn();
    window.addEventListener('realtime:downloads', listener);
    act(() => {
      handlers['downloads:created'] && handlers['downloads:created']({ title: 'Another' });
    });
    expect(listener).toHaveBeenCalled();

    // disconnect on unmount
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
