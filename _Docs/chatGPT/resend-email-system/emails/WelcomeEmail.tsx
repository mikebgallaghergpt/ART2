import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Preview } from '@react-email/preview';
import { Body } from '@react-email/body';
import { Container } from '@react-email/container';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';

type Props = {
  first_name: string;
  goals_list?: string;
  experience_level?: string;
  interests_list?: string;
  referral_source?: string;
  gift_certificate_link?: string;
  isUpdate?: boolean;
  current_year?: number;
  unsubscribe_url?: string;
};

export const WelcomeEmail = ({
  first_name,
  goals_list,
  experience_level,
  interests_list,
  referral_source,
  gift_certificate_link,
  isUpdate = false,
  current_year = new Date().getFullYear(),
  unsubscribe_url = '#',
}: Props) => {
  const headerStyle = {
    background: isUpdate
      ? 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '30px',
    textAlign: 'center' as const,
    borderRadius: '8px 8px 0 0',
  };

  const infoBoxStyle = {
    background: isUpdate ? '#E3F2FD' : 'white',
    padding: '15px',
    borderRadius: '6px',
    margin: '20px 0',
    borderLeft: `4px solid ${isUpdate ? '#4A90E2' : '#667eea'}`,
  };

  const buttonStyle = {
    background: isUpdate ? '#4A90E2' : '#667eea',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '6px',
    display: 'inline-block',
    textDecoration: 'none',
    margin: '20px 0',
  };

  return (
    <Html>
      <Head />
      <Preview>{isUpdate ? 'Profile Updated' : 'Welcome to Gallagher Art School'}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <div style={headerStyle}>
            <h1>{isUpdate ? '✓ Profile Updated!' : 'Welcome to Gallagher Art School!'}</h1>
          </div>

          <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '0 0 8px 8px' }}>
            <Text>{isUpdate ? `Welcome back, ${first_name}!` : `Hi ${first_name},`}</Text>
            <Text>
              {isUpdate
                ? 'Your profile preferences at Gallagher Art School have been successfully updated.'
                : "Thank you for your interest in Gallagher Art School! We're thrilled to have you join our community of passionate artists."}
            </Text>

            <div style={infoBoxStyle}>
              <Text>
                <strong>{isUpdate ? 'Updated Information:' : 'Your Profile Selections:'}</strong>
              </Text>
              {goals_list && <Text><strong>Goals:</strong> {goals_list}</Text>}
              {experience_level && <Text><strong>Experience Level:</strong> {experience_level}</Text>}
              {interests_list && <Text><strong>Interests:</strong> {interests_list}</Text>}
              {referral_source && <Text><strong>Referral Source:</strong> {referral_source}</Text>}
            </div>

            {gift_certificate_link && (
              <div style={{ background: '#FFF3CD', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #FFC107', margin: '20px 0' }}>
                <Text>🎁 You mentioned interest in a gift certificate! You can find more info or purchase one here:</Text>
                <Link href={gift_certificate_link}>{gift_certificate_link}</Link>
              </div>
            )}

            {isUpdate && (
              <div style={{ background: '#FFF3CD', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #FFC107', margin: '20px 0' }}>
                <Text><strong>🔒 Security Note:</strong> Your login details remain the same. If you didn't make these changes, contact us at info@gallagherartschool.com</Text>
              </div>
            )}

            <Text>
              {isUpdate
                ? "We're excited to continue your art journey with us!"
                : "Based on your interests, we think you'll love our upcoming classes. We'll be in touch soon with personalized recommendations!"}
            </Text>

            <Link href="https://gallagherartschool.com/classes" style={buttonStyle}>
              Explore Our Classes
            </Link>

            <Text>Questions? Reply to this email anytime.</Text>
            <Text>Best regards,<br />The Gallagher Art School Team</Text>
          </div>

          <div style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: '#666' }}>
            <Text>© {current_year} Gallagher Art School. All rights reserved.</Text>
            <Text><Link href={unsubscribe_url} style={{ color: '#999', textDecoration: 'none' }}>Unsubscribe</Link></Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;