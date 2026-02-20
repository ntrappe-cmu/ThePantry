import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MenuBar from '../../src/components/menu-bar';

afterEach(() => {
  cleanup();
});

test('MenuBar dispatches menuBarSwitch and updates selected state when options are clicked', () => {
  const handler = jest.fn();
  document.addEventListener('menuBarSwitch', handler);

  render(<MenuBar />);

  // Home button should exist and be selectable
  const home = screen.getByText('Home');
  expect(home).toBeInTheDocument();

  // Click Home (should dispatch event with view: 'home')
  fireEvent.click(home);
  expect(handler).toHaveBeenCalled();
  const firstEvent = handler.mock.calls[0][0];
  expect(firstEvent).toBeDefined();
  expect(firstEvent.detail.view).toBe('home');

  // Click Requests and verify event payload and selected class
  const requests = screen.getByText('Requests');
  fireEvent.click(requests);
  const secondEvent = handler.mock.calls[1][0];
  expect(secondEvent.detail.view).toBe('requests');

  // The clicked option's closest button should have the selected class
  const requestsButton = requests.closest('button');
  expect(requestsButton).toHaveClass('selected');

  document.removeEventListener('menuBarSwitch', handler);
});