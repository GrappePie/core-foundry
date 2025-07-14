import { Html, Head, Body, Container, Tailwind } from '@react-email/components';
import { ReactNode } from 'react';

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
          <Container style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
