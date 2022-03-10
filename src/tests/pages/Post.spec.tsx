import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

const post = {
  slug: 'post-slug',
  title: 'New Post',
  content: 'Post content',
  updatedAt: '01 de março de 2022',
};

describe('Post Page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('New Post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
  });

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: 'post-slug' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/',
          permanent: false,
        },
      })
    );
  });

  it('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-subcription',
    });

    const getPrismicClientMocked = jest.mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: post.title }],
          content: [{ type: 'paragraph', text: post.content }],
        },
        last_publication_date: '03-10-2022',
      }),
    } as any);

    const response = await getServerSideProps({
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
