import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from './Button.tsx';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { label: 'Accent' },
} satisfies Meta<typeof Button>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLElement>('[data-testid="example-button"]');
    expect(button).not.toBeNull();
    // useToken resolved a css-var reference into the style; it must be a var(--...) ref.
    expect(button?.getAttribute('data-bg-var')).toMatch(/^var\(--/);
  },
};
