import { render, screen } from '@testing-library/react';
import App from './App';

test('renders school year progress heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Avancement de l'année scolaire/i);
  expect(headingElement).toBeInTheDocument();
});
