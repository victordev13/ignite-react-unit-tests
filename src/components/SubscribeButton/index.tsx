import { signIn, useSession } from 'next-auth/client';
import styles from './styles.module.scss';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-browser';
import { useRouter } from 'next/dist/client/router';

export function SubscribeButton() {
  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribeButton() {
    if (!session) {
      signIn('github');
      return;
    }

    if (session.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const response = await api.post('/subscribe');
      const { sessionId } = response.data;
      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err.message);
    }
  }
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={() => handleSubscribeButton()}>
      Subscribe now
    </button>
  );
}
