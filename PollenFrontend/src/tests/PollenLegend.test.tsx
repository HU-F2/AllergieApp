// src/tests/PollenLegend.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PollenLegend } from '../components/PollenLegend';

// 🧪 Mock the external dependency completely
jest.mock('../components/PollenMap', () => ({
  pollenMeta: {
    grass: { baseColor: [0, 128, 0], min: 0, max: 20 },
    tree: { baseColor: [255, 140, 0], min: 2, max: 10 },
    weed: { baseColor: [123, 31, 162], min: 0, max: 7 },
  },
  PollenTypes: {
    GRASS: 'grass',
    TREE: 'tree',
    WEED: 'weed',
  },
}));

const { PollenTypes } = jest.requireMock('../components/PollenMap');

describe('<PollenLegend />', () => {
  const pollenType = PollenTypes.GRASS;

  it('renders the legend with correct labels and gradient', () => {
    render(<PollenLegend pollenType={pollenType} />);

    expect(screen.getByText(/Weinig \(0\)/)).toBeInTheDocument();
    expect(screen.getByText(/Veel \(20\)/)).toBeInTheDocument();

    const expectedGradient = `linear-gradient(to right, rgba(0,128,0, 0.1), rgba(0,128,0, 1))`;
    const gradientDiv = screen.getByTestId('pollen-gradient');
    expect(gradientDiv).toHaveStyle(`background: ${expectedGradient}`);
  });
});
