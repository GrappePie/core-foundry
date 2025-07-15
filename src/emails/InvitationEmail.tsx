import { Heading, Text, Link } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface Props {
  tenantName: string;
  role: string;
}

export default function InvitationEmail({ tenantName, role }: Props) {
  return (
    <BaseLayout>
      <Heading>Invitación a {tenantName}</Heading>
      <Text>Has sido invitado como {role}. Haz clic en el siguiente enlace para aceptar la invitación.</Text>
      <Link href={`${process.env.NEXTAUTH_URL}/accept-invite`}>Aceptar invitación</Link>
    </BaseLayout>
  );
}
