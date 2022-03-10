import { render, screen } from '@testing-library/react';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic');

const posts = [
  {
    slug: 'post-slug',
    title: 'New Post',
    excerpt: 'Post excerpt',
    updatedAt: '01 de Março de 2022',
  },
];

describe('Posts Page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />);

    expect(
      screen.getByText('New Post')
    ).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(
      getPrismicClient
    );
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'post-slug',
            data: {
              title: [
                { type: 'heading', text: 'New Post' },
              ],
              content: [
                { type: 'paragraph', text: 'Post excerpt' },
              ],
            },
            last_publication_date: '03-01-2022',
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              ...posts[0],
              excerpt: 'Post excerpt...',
              updatedAt: '01 de março de 2022',
            },
          ],
        },
      })
    );
  });
});
