import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import { signIn, useSession } from 'next-auth/client';
import { SubscribeButton } from '.';
import { useRouter } from 'next/router';

jest.mock('next-auth/client');

jest.mock('next/router');

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    expect(
      screen.getByText('Subscribe now')
    ).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticaded', () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton =
      screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signIn).toHaveBeenCalled();
  });

  it('redirects to posts when user already has a subscription', () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMocked = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'johndoe@gmail.com',
        },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires',
      },
      true,
    ]);

    render(<SubscribeButton />);

    const subscribeButton =
      screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signIn).toHaveBeenCalledWith('/posts');
  });
});
