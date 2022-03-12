import { render, screen } from '@testing-library/react';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import PostPreview, {
  getStaticProps,
} from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

const post = {
  slug: 'post-slug',
  title: 'New Post',
  content: 'Post content',
  updatedAt: '01 de março de 2022',
};

describe('Post Preview Page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<PostPreview post={post} />);

    expect(
      screen.getByText('Wanna continue reading?')
    ).toBeInTheDocument();
  });

  it('redirects user to full post content when user is subscribed', async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMocked = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-subscription' },
      false,
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMocked).toHaveBeenCalledWith(
      `/posts/${post.slug}`
    );
  });

  it('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-subcription',
    });

    const getPrismicClientMocked = jest.mocked(
      getPrismicClient
    );
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: post.title }],
          content: [
            { type: 'paragraph', text: post.content },
          ],
        },
        last_publication_date: '03-10-2022',
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: 'post-slug' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            content: '<p>Post content</p>',
            slug: 'post-slug',
            title: 'New Post',
            updatedAt: '10 de março de 2022',
          },
        },
      })
    );
  });
});
