import { Heading, Text } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface Props {
  amount: string;
}

export default function BillingNotificationEmail({ amount }: Props) {
  return (
    <BaseLayout>
      <Heading>Factura pagada</Heading>
      <Text>Hemos recibido tu pago de {amount}. Gracias por mantener tu suscripción al día.</Text>
    </BaseLayout>
  );
}
