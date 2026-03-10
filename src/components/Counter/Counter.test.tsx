import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Counter } from './Counter';

const getCount = () => screen.getByText(/^-?\d+$/);

describe('Counter', () => {
    it('renders with initial count 0', () => {
        render(<Counter />);
        expect(getCount()).toHaveTextContent('0');
    });

    it('increments count on + click', async () => {
        const user = userEvent.setup();
        render(<Counter />);

        await user.click(screen.getByRole('button', { name: '+' }));

        expect(getCount()).toHaveTextContent('1');
    });

    it('decrements count on − click', async () => {
        const user = userEvent.setup();
        render(<Counter />);

        await user.click(screen.getByRole('button', { name: '−' }));

        expect(getCount()).toHaveTextContent('-1');
    });

    it('resets count to 0', async () => {
        const user = userEvent.setup();
        render(<Counter />);

        await user.click(screen.getByRole('button', { name: '+' }));
        await user.click(screen.getByRole('button', { name: '+' }));
        await user.click(screen.getByRole('button', { name: 'reset' }));

        expect(getCount()).toHaveTextContent('0');
    });

    it('handles multiple increments and decrements', async () => {
        const user = userEvent.setup();
        render(<Counter />);

        await user.click(screen.getByRole('button', { name: '+' }));
        await user.click(screen.getByRole('button', { name: '+' }));
        await user.click(screen.getByRole('button', { name: '+' }));
        await user.click(screen.getByRole('button', { name: '−' }));

        expect(getCount()).toHaveTextContent('2');
    });
});
