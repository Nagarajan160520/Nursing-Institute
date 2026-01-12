import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import Attendance from '../components/StudentPortal/Academics/Attendance';
import * as api from '../services/api';

jest.mock('../services/api');

describe('Attendance realtime refresh', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('refetches when realtime:attendance event is dispatched', async () => {
    // initial call for subjects
    api.default.get = jest.fn()
      .mockResolvedValueOnce({ data: { data: { attendance: [{ subject: 'Math' }] } } }) // fetchSubjects
      .mockResolvedValueOnce({ data: { data: { attendance: [{ date: new Date(), subject: 'Math' }], stats: {} } } }); // fetchAttendance

    const { getByText } = render(<Attendance />);

    await waitFor(() => expect(api.default.get).toHaveBeenCalled());

    // dispatch custom event
    act(() => {
      window.dispatchEvent(new CustomEvent('realtime:attendance', { detail: { subject: 'Math' } }));
    });

    // After event, fetchAttendance should be called again
    await waitFor(() => {
      expect(api.default.get).toHaveBeenCalledTimes(2);
    });
  });
});
