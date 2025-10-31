// @deno-types="npm:@resend/client"
import { Resend } from 'npm:resend';
import { render } from 'npm:@react-email/components';
import { WelcomeEmail } from '../../emails/WelcomeEmail.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  const {
    first_name,
    email,
    goals_list,
    experience_level,
    interests_list,
    referral_source,
    gift_certificate_link,
    isUpdate = false,
  } = await req.json();

  const html = render(WelcomeEmail({
    first_name,
    goals_list,
    experience_level,
    interests_list,
    referral_source,
    gift_certificate_link,
    isUpdate,
    current_year: new Date().getFullYear(),
    unsubscribe_url: "https://gallagherartschool.com/unsubscribe"
  }));

  const { data, error } = await resend.emails.send({
    from: "Gallagher Art School <info@gallagherartschool.com>",
    to: email,
    subject: isUpdate
      ? "Your Gallagher Art School Profile Has Been Updated"
      : "Welcome to Gallagher Art School!",
    html,
  });

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ data }), { status: 200 });
});