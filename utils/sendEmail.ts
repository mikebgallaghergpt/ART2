// utils/sendEmail.ts
// Postmark email integration for welcome emails

export interface EmailResponse {
  success: boolean;
  error?: string;
  messageId?: string;
}

export const sendWelcomeEmail = async (
  email: string,
  firstName: string,
  interests: string[]
): Promise<EmailResponse> => {
  try {
    // Get Postmark configuration from environment variables
    const postmarkToken = import.meta.env.VITE_POSTMARK_SERVER_TOKEN;
    const templateId = import.meta.env.VITE_POSTMARK_TEMPLATE_ID;

    // Check if Postmark is configured
    if (!postmarkToken) {
      console.warn('Postmark not configured - email not sent');
      return { 
        success: false, 
        error: 'Email service not configured' 
      };
    }

    // Prepare template data
    const templateData = {
      first_name: firstName,
      interests: interests.length > 0 ? interests.join(', ') : 'Not specified'
    };

    // Send email via Postmark API
    const response = await fetch('https://api.postmarkapp.com/email/withTemplate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkToken
      },
      body: JSON.stringify({
        From: 'hello@gallagherartschool.com', // Change to your verified sender
        To: email,
        TemplateId: templateId ? parseInt(templateId) : undefined,
        TemplateModel: templateData,
        MessageStream: 'outbound'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.Message || 'Failed to send email');
    }

    const result = await response.json();
    
    console.log('Welcome email sent successfully:', {
      to: email,
      messageId: result.MessageId
    });

    return { 
      success: true, 
      messageId: result.MessageId 
    };

  } catch (error) {
    console.error('Email send error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Optional: Send newsletter-only subscription confirmation
export const sendNewsletterConfirmation = async (
  email: string,
  firstName: string
): Promise<EmailResponse> => {
  try {
    const postmarkToken = import.meta.env.VITE_POSTMARK_SERVER_TOKEN;

    if (!postmarkToken) {
      console.warn('Postmark not configured - newsletter confirmation not sent');
      return { 
        success: false, 
        error: 'Email service not configured' 
      };
    }

    // Simple newsletter confirmation (you can create a separate template for this)
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkToken
      },
      body: JSON.stringify({
        From: 'hello@gallagherartschool.com',
        To: email,
        Subject: `Welcome to Gallagher Art School Newsletter, ${firstName}!`,
        HtmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank you for subscribing, ${firstName}!</h2>
            <p>You're now subscribed to our newsletter and will receive:</p>
            <ul>
              <li>Art tips and techniques</li>
              <li>Class updates and announcements</li>
              <li>Special offers and events</li>
            </ul>
            <p>We're excited to have you as part of our art community!</p>
            <p>Best regards,<br>The Gallagher Art School Team</p>
          </div>
        `,
        MessageStream: 'outbound'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.Message || 'Failed to send newsletter confirmation');
    }

    const result = await response.json();
    
    return { 
      success: true, 
      messageId: result.MessageId 
    };

  } catch (error) {
    console.error('Newsletter confirmation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};