# COMPLai Email Templates

This directory contains email templates for COMPLai's authentication system. These templates are designed to be used with Supabase Auth and provide a professional, branded experience for users.

## Available Templates

### 1. Confirm Signup (`confirm-signup.html` & `confirm-signup.txt`)

- **Purpose**: Email verification for new user registrations
- **Trigger**: When a user signs up for a new account
- **Template Variables**:
  - `{{ .ConfirmationURL }}` - The verification link
  - `{{ .SiteURL }}` - Your website URL
  - `{{ .Email }}` - The user's email address

### 2. Reset Password (`reset-password.html` & `reset-password.txt`)

- **Purpose**: Password reset functionality
- **Trigger**: When a user requests a password reset
- **Template Variables**:
  - `{{ .ConfirmationURL }}` - The password reset link
  - `{{ .SiteURL }}` - Your website URL
  - `{{ .Email }}` - The user's email address

## Design Features

### Visual Design

- **Brand Colors**: Purple gradient (#8b5cf6 to #7c3aed) matching COMPLai's brand
- **Modern Layout**: Clean, professional design with rounded corners and subtle shadows
- **Responsive**: Mobile-friendly design that works across all email clients
- **Typography**: System fonts for optimal readability

### Security Features

- **Clear Messaging**: Explicit instructions about what each email is for
- **Security Warnings**: Reminders about link expiration and one-time use
- **Fallback Links**: Plain text links in case HTML doesn't render
- **Professional Branding**: Builds trust with consistent COMPLai branding

## How to Configure in Supabase

### 1. Access Email Templates

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**
3. You'll see different template types (Confirm signup, Reset password, etc.)

### 2. Update Templates

1. Click on the template you want to update
2. Copy the HTML content from the corresponding `.html` file
3. Paste it into the **HTML** field in Supabase
4. Copy the text content from the corresponding `.txt` file
5. Paste it into the **Text** field in Supabase
6. Click **Save** to update the template

### 3. Template Configuration

- **Subject Line**: Customize the email subject line
- **From Email**: Set the sender email address
- **From Name**: Set the sender name (e.g., "COMPLai Team")

## Template Variables

Supabase provides these variables that you can use in templates:

- `{{ .ConfirmationURL }}` - The action URL (verification/reset link)
- `{{ .SiteURL }}` - Your site URL (from environment variables)
- `{{ .Email }}` - The recipient's email address
- `{{ .Token }}` - The verification/reset token (for custom implementations)

## Customization Options

### Colors

To change the brand colors, update these CSS variables in the HTML:

```css
background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
color: #8b5cf6;
```

### Logo

The templates include a simple SVG shield logo. You can replace it with your own logo by updating the SVG in the header section.

### Content

Feel free to modify the text content to match your brand voice and requirements.

## Email Client Compatibility

These templates are designed to work with:

- ✅ Gmail (web & mobile)
- ✅ Outlook (web & desktop)
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Thunderbird
- ✅ Mobile email apps

### Best Practices

- All styles are inline for maximum compatibility
- Responsive design with mobile-first approach
- Fallback fonts for cross-platform consistency
- Alt text for images (when applicable)

## Security Considerations

### Link Expiration

- Password reset links expire after 1 hour
- Email verification links have configurable expiration
- One-time use tokens for security

### User Experience

- Clear instructions for users
- Multiple ways to complete actions (button + link)
- Professional appearance builds trust

## Next Steps

### Additional Templates

Consider creating these additional email templates:

- Welcome email (after successful verification)
- Account deletion confirmation
- Security alert emails
- Team invitation emails

### Advanced Features

- Dynamic content based on user preferences
- Localization for multiple languages
- A/B testing for template optimization
- Email analytics and tracking

## Support

If you need help with email template configuration or have questions about the design, please contact the development team.

---

**Note**: Always test email templates in multiple email clients before deploying to production. Consider using email testing services like Email on Acid or Litmus for comprehensive testing.
