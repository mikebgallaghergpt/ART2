// supabase/functions/make-server-9c2430a9/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { ServerClient } from 'https://esm.sh/postmark@3.0.19'; // Keep using fetch approach

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Restrict in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define options arrays GLOBALLY
const interestOptions = [ { value: 'drawing', label: 'Drawing' }, { value: 'painting', label: 'Painting' }, { value: 'sculpture', label: 'Sculpture' }, { value: 'mixed-media', label: 'Mixed Media AI & Collage' }, { value: 'color-theory', label: 'Color Theory' }, ];
const goalOptions = [ { value: 'develop-skills', label: 'Develop fundamental art skills' }, { value: 'portfolio', label: 'Prepare portfolio for college/university' }, { value: 'creativity', label: 'Explore creativity and self-expression' }, { value: 'learn-techniques', label: 'Learn specific techniques' }, { value: 'professional-dev', label: 'Professional development' }, { value: 'connect', label: 'Connect with other artists' }, { value: 'enrichment', label: 'Personal enrichment and relaxation' }, { value: 'career-change', label: 'Career change or advancement' }, { value: 'gift-certificate', label: 'Gift certificate for someone' }, ];


serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }

  try {
    console.log('Signup function called');
    const { firstName, lastName, email, phone, goals, experienceLevel, interests, referralSource, password, newsletterOptIn } = await req.json();
    console.log('Received data:', { firstName, email });

    // Validation
    if (!firstName || !lastName || !email) { throw new Error('Missing required fields'); }
    const goalsArray = Array.isArray(goals) ? goals : (goals ? [goals] : []);
    const interestsArray = Array.isArray(interests) ? interests : (interests ? [interests] : []);

    // Supabase client setup
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!supabaseUrl || !supabaseServiceKey) { throw new Error('Server configuration error.'); }
    const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } });

    // Check profile
    const { data: existingProfile, error: profileCheckError } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
    if (profileCheckError) { throw new Error('Database error checking profile.'); }
    const isUpdate = !!existingProfile; // Determine if it's an update
    console.log('Is update:', isUpdate);

    // Prep profile data
    const profileData: any = { /* ... profile data ... */ };
     profileData.first_name = firstName; profileData.last_name = lastName; profileData.email = email; profileData.phone = phone || null; profileData.experience = experienceLevel || null; profileData.interests = interestsArray.length > 0 ? interestsArray : null; profileData.goals = goalsArray.length > 0 ? goalsArray : null; profileData.how_heard = referralSource || null; profileData.newsletter = newsletterOptIn || false; profileData.updated_at = new Date().toISOString();
    let userId = existingProfile?.id;
    if (!isUpdate && password) { /* ... auth user creation ... */ const { data: authData, error: authError } = await supabase.auth.admin.createUser({ email: email, password: password, email_confirm: true, user_metadata: { first_name: firstName, last_name: lastName } }); if (authError) { if (authError.message.includes('already registered')) { return new Response(JSON.stringify({ success: false, error: 'User already exists.' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }); } throw new Error(`Auth Error: ${authError.message}`); } userId = authData.user!.id; profileData.id = userId; profileData.created_at = new Date().toISOString();
    } else if (!isUpdate) { profileData.created_at = new Date().toISOString(); }

    // Upsert profile
    console.log('Upserting profile...');
    const { data: profileResult, error: profileError } = await supabase.from('profiles').upsert(profileData, { onConflict: 'email' }).select().single();
    if (profileError) { throw new Error(`Database Error: ${profileError.message}`); }
    console.log('Profile saved successfully.');

    // ---- Postmark Email Logic (Simplified Template, Sends isUpdate flag) ----
    try {
      const postmarkToken = Deno.env.get('POSTMARK_SERVER_TOKEN');
      const welcomeTemplateId = Deno.env.get('POSTMARK_WELCOME_TEMPLATE_ID') || '41756393';
      const updateTemplateId = Deno.env.get('POSTMARK_UPDATE_TEMPLATE_ID') || '41826719';
      const fromEmail = Deno.env.get('POSTMARK_FROM_EMAIL') || 'info@gallagherartschool.com';

      if (!postmarkToken) {
          console.warn('Postmark server token not found. Skipping email.');
      } else {
           console.log('Preparing Postmark template model...');
           const templateId = isUpdate ? parseInt(updateTemplateId) : parseInt(welcomeTemplateId);

           // Format data strings
           const goalsStr = goalsArray.length > 0 ? goalsArray.map(g => goalOptions.find(opt => opt.value === g)?.label || g).join(', ') : '';
           const experienceStr = experienceLevel ? experienceLevel.replace('-', ' ') : '';
           const interestsStr = interestsArray.length > 0 ? interestsArray.map(i => interestOptions.find(opt => opt.value === i)?.label || i).join(', ') : '';
           const referralStr = referralSource ? referralSource.charAt(0).toUpperCase() + referralSource.slice(1) : '';
           const giftLink = goalsArray.includes('gift-certificate') ? 'https://gallagherartschool.com/gift-certificate/' : undefined;

           // ✨ Create model for simplified template, including isUpdate flag
           const templateModel = {
             first_name: firstName,
             goals_list: goalsStr,
             experience_level: experienceStr,
             interests_list: interestsStr,
             referral_source: referralStr,
             gift_certificate_link: giftLink,
             isUpdate: isUpdate, // Send the boolean flag
             // Standard values
             product_name: "Gallagher Art School",
             company_name: "Gallagher Art School",
            };
           console.log(`Sending ${isUpdate ? 'Update' : 'Welcome'} email model:`, templateModel);

           // Use fetch to call Postmark API directly
           const response = await fetch('https://api.postmarkapp.com/email/withTemplate', {
               method: 'POST',
               headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Postmark-Server-Token': postmarkToken },
               body: JSON.stringify({ From: fromEmail, To: email, TemplateId: templateId, TemplateModel: templateModel })
           });

           if (response.ok) {
               const result = await response.json();
               console.log(`Email sent successfully via fetch to ${email}. Postmark Response:`, result);
           } else {
               const errorBody = await response.text();
               console.error(`Postmark API error: Status ${response.status}`, errorBody);
               throw new Error(`Failed to send email via Postmark API. Status: ${response.status}`);
           }
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError.message || emailError);
    }
    // ---- End Postmark Email Logic ----

    // Success response
    return new Response( JSON.stringify({ success: true, isUpdate: isUpdate, message: isUpdate ? 'Profile updated' : 'Account created', profile: profileResult }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 } )

  } catch (error) {
    console.error('Unhandled error in signup function:', error)
    return new Response( JSON.stringify({ success: false, error: error.message || 'Internal server error' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 } )
  }
})