import { render } from '@react-email/render';
import { writeFileSync } from 'fs';
import { WelcomeEmail } from '../emails/WelcomeEmail';

const html = render(
  WelcomeEmail({
    first_name: 'Mike',
    goals_list: 'Join contests, Improve portraiture',
    experience_level: 'Intermediate',
    interests_list: 'Sketching, Painting',
    referral_source: 'Instagram',
    gift_certificate_link: 'https://gallagherartschool.com/gift-certificates/',
    isUpdate: false,
    unsubscribe_url: 'https://gallagherartschool.com/unsubscribe',
  })
);

// Save preview as HTML
writeFileSync('preview.html', html);
console.log('Preview written to preview.html');