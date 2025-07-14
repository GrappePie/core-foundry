import { Heading, Text } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface Props {
  plan: string;
}

export default function SubscriptionConfirmationEmail({ plan }: Props) {
  return (
    <BaseLayout>
      <Heading>Suscripción Activada</Heading>
      <Text>Gracias por suscribirte al plan {plan}. Tu suscripción está activa.</Text>
    </BaseLayout>
  );
}
