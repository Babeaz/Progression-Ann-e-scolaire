import { render, screen } from '@testing-library/react';
import App from './App';

test('renders school year progress tracker', () => {
  render(<App />);
  const titleElement = screen.getByText(/Avancement de l'année scolaire/i);
  expect(titleElement).toBeInTheDocument();
});
