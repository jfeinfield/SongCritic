import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock("parse");

test('renders fetch items button', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Fetch Items/i);
  expect(linkElement).toBeInTheDocument();
});
