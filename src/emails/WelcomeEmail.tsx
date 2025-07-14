import { Heading, Text } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface WelcomeEmailProps {
  userName?: string;
}

export default function WelcomeEmail({ userName }: WelcomeEmailProps) {
  return (
    <BaseLayout>
      <Heading>Bienvenido a CoreFoundry{userName ? `, ${userName}` : ''}!</Heading>
      <Text>Tu cuenta ha sido creada correctamente. Ya puedes empezar a explorar la plataforma.</Text>
    </BaseLayout>
  );
}
