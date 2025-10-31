import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', logger(console.log));
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Register new student
app.post('/make-server-9c2430a9/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      birthDate, 
      experience, 
      interests, 
      hearAboutUs,
      hearAboutUsOther,
      password,
      newsletter 
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check if user already exists
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({ error: 'User already exists with this email' }, 400);
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`
      },
      email_confirm: true // Auto-confirm email since we don't have email server configured
    });

    if (authError) {
      console.log('Supabase auth error:', authError);
      return c.json({ error: 'Failed to create user account' }, 500);
    }

    const userId = authData.user?.id;
    if (!userId) {
      return c.json({ error: 'Failed to get user ID' }, 500);
    }

    // Store user profile data in KV store
    const userProfile = {
      id: userId,
      firstName,
      lastName,
      email,
      phone: phone || '',
      birthDate: birthDate || '',
      experience: experience || '',
      interests: interests || [],
      hearAboutUs: hearAboutUs || '',
      hearAboutUsOther: hearAboutUsOther || '',
      newsletter: newsletter || false,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    await kv.set(`user:${email}`, userProfile);
    await kv.set(`profile:${userId}`, userProfile);

    // Store in interests index for easy querying
    if (interests && interests.length > 0) {
      for (const interest of interests) {
        const existingInterest = await kv.get(`interest:${interest}`) || [];
        existingInterest.push(userId);
        await kv.set(`interest:${interest}`, existingInterest);
      }
    }

    // Store in experience level index
    if (experience) {
      const existingExperience = await kv.get(`experience:${experience}`) || [];
      existingExperience.push(userId);
      await kv.set(`experience:${experience}`, existingExperience);
    }

    // Store in hear about us index
    if (hearAboutUs) {
      const existingSource = await kv.get(`source:${hearAboutUs}`) || [];
      existingSource.push({ userId, hearAboutUsOther: hearAboutUsOther || null, createdAt: new Date().toISOString() });
      await kv.set(`source:${hearAboutUs}`, existingSource);
    }

    // Add to newsletter list if opted in
    if (newsletter) {
      const newsletterList = await kv.get('newsletter:subscribers') || [];
      newsletterList.push({ userId, email, firstName, lastName, subscribedAt: new Date().toISOString() });
      await kv.set('newsletter:subscribers', newsletterList);
    }

    return c.json({ 
      success: true, 
      message: 'Account created successfully!',
      user: {
        id: userId,
        email,
        firstName,
        lastName
      }
    });

  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// User login
app.post('/make-server-9c2430a9/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Login error:', error);
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Get user profile
    const userProfile = await kv.get(`profile:${data.user?.id}`);
    
    return c.json({ 
      success: true,
      message: 'Login successful',
      user: userProfile,
      session: data.session
    });

  } catch (error) {
    console.log('Login error:', error);
    return c.json({ error: 'Internal server error during login' }, 500);
  }
});

// Get user profile (protected route)
app.get('/make-server-9c2430a9/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Access token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    const userProfile = await kv.get(`profile:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ success: true, profile: userProfile });

  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, 500);
  }
});

// Update user profile (protected route)
app.put('/make-server-9c2430a9/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Access token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    const body = await c.req.json();
    const currentProfile = await kv.get(`profile:${user.id}`);
    
    if (!currentProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Update profile
    const updatedProfile = {
      ...currentProfile,
      ...body,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`profile:${user.id}`, updatedProfile);
    await kv.set(`user:${updatedProfile.email}`, updatedProfile);

    return c.json({ 
      success: true, 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    });

  } catch (error) {
    console.log('Profile update error:', error);
    return c.json({ error: 'Internal server error while updating profile' }, 500);
  }
});

// Get students by interest (admin endpoint)
app.get('/make-server-9c2430a9/students/by-interest/:interest', async (c) => {
  try {
    const interest = c.req.param('interest');
    const studentIds = await kv.get(`interest:${interest}`) || [];
    
    const students = [];
    for (const studentId of studentIds) {
      const student = await kv.get(`profile:${studentId}`);
      if (student) {
        students.push({
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          experience: student.experience,
          createdAt: student.createdAt
        });
      }
    }

    return c.json({ success: true, interest, students });

  } catch (error) {
    console.log('Students by interest error:', error);
    return c.json({ error: 'Internal server error while fetching students' }, 500);
  }
});

// Get newsletter subscribers
app.get('/make-server-9c2430a9/newsletter/subscribers', async (c) => {
  try {
    const subscribers = await kv.get('newsletter:subscribers') || [];
    return c.json({ success: true, subscribers, count: subscribers.length });

  } catch (error) {
    console.log('Newsletter subscribers error:', error);
    return c.json({ error: 'Internal server error while fetching subscribers' }, 500);
  }
});

// Get referral source analytics
app.get('/make-server-9c2430a9/analytics/referral-sources', async (c) => {
  try {
    const sources = ['google', 'social', 'flyer', 'school', 'friend', 'event', 'gallery', 'returning', 'other'];
    const analytics = {};
    
    for (const source of sources) {
      const sourceData = await kv.get(`source:${source}`) || [];
      analytics[source] = {
        count: sourceData.length,
        details: sourceData
      };
    }

    return c.json({ success: true, analytics });

  } catch (error) {
    console.log('Referral source analytics error:', error);
    return c.json({ error: 'Internal server error while fetching analytics' }, 500);
  }
});

// Health check
app.get('/make-server-9c2430a9/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);