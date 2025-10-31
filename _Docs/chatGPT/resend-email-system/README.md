# Resend + React Email + Supabase Edge Function

This project demonstrates how to send custom welcome/update emails using [Resend](https://resend.com) + [React Email](https://react.email) from a Supabase Edge Function.

## 🔧 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add your `.env` file

```
RESEND_API_KEY=your_resend_api_key
```

### 3. Run email preview

```bash
npm run preview:email
```

This generates `preview.html` using sample data.

### 4. Deploy your Supabase Edge Function

```bash
supabase functions deploy send-confirmation-email
```

## 📂 Files

- `emails/WelcomeEmail.tsx` – your React Email template
- `functions/send-confirmation-email/index.ts` – your Edge Function
- `scripts/renderPreview.ts` – local preview generator

## 📤 Email Params

This is the expected JSON payload:

```json
{
  "first_name": "Mike",
  "email": "mike@example.com",
  "goals_list": "Join contests, Improve portraiture",
  "experience_level": "Intermediate",
  "interests_list": "Sketching, Painting",
  "referral_source": "Instagram",
  "gift_certificate_link": "https://gallagherartschool.com/gift-certificates/",
  "isUpdate": false
}
```

## 💌 Output

- Uses dynamic logic (update vs welcome)
- Gift link section only shows if present
- Fully styled responsive layout