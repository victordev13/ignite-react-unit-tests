import { render, screen } from '@testing-library/react';
import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  };
});

jest.mock('../../services/stripe');

describe('Home Page', () => {
  it('renders correctly', () => {
    render(
      <Home
        product={{
          priceId: 'fake-price-id',
          amount: 'R$10,00',
        }}
      />
    );

    expect(
      screen.getByText('for R$10,00 month')
    ).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const retrievePricesStripe = jest.mocked(stripe.prices.retrieve);

    retrievePricesStripe.mockResolvedValueOnce({ // mock promisse
      id: 'fake-price-id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    );
  })
});
