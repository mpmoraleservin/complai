# COMPLai Email Templates

This directory contains professional email templates for COMPLai's authentication system.

## 📧 Templates Included

### 1. Confirm Signup Email

- **HTML Version**: `confirm-signup.html`
- **Text Version**: `confirm-signup.txt`
- **Purpose**: Email verification for new user registration

## 🎨 Design Features

### Brand Identity

- **Colors**: Purple gradient (#7c3aed to #8b5cf6) matching COMPLai brand
- **Logo**: Shield emoji (🛡️) representing security and compliance
- **Typography**: Modern system fonts for optimal readability

### Professional Elements

- ✅ **Responsive design** for mobile and desktop
- ✅ **Clear call-to-action** button
- ✅ **Security notes** for user confidence
- ✅ **Feature preview** to showcase value
- ✅ **Professional footer** with legal links
- ✅ **Accessibility** considerations

## 🔧 How to Configure in Supabase

### Step 1: Access Email Templates

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Select **Confirm signup** template

### Step 2: Configure HTML Template

1. **Copy the HTML content** from `confirm-signup.html`
2. **Paste it** into the HTML template field in Supabase
3. **Keep the variable** `{{ .ConfirmationURL }}` as is (Supabase will replace it)

### Step 3: Configure Text Template

1. **Copy the text content** from `confirm-signup.txt`
2. **Paste it** into the Text template field in Supabase
3. **Keep the variable** `{{ .ConfirmationURL }}` as is

### Step 4: Test the Template

1. **Save** the template
2. **Register a new user** to test the email
3. **Check** that the email renders correctly in different email clients

## 📋 Template Variables

Supabase automatically replaces these variables:

- `{{ .ConfirmationURL }}` - The verification link
- `{{ .Email }}` - User's email address
- `{{ .TokenHash }}` - Token hash (if needed)

## 🎯 Customization Options

### Colors

To change the brand colors, update these CSS variables:

```css
background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
```

### Logo

Replace the shield emoji with your actual logo:

```html
<div class="logo-icon">🛡️</div>
```

### Features

Update the feature list to match your current offerings:

```html
<li class="feature-item">
  <div class="feature-icon">✓</div>
  <span>Your feature here</span>
</li>
```

### Links

Update the footer links to point to your actual pages:

```html
<a href="https://yourdomain.com/support" class="footer-link">Support</a>
```

## 📱 Email Client Compatibility

### Tested On:

- ✅ Gmail (Desktop & Mobile)
- ✅ Outlook (Desktop & Mobile)
- ✅ Apple Mail
- ✅ Thunderbird
- ✅ Yahoo Mail

### Best Practices:

- ✅ **Inline CSS** for maximum compatibility
- ✅ **Table-based layout** (if needed for complex designs)
- ✅ **Fallback fonts** for cross-platform consistency
- ✅ **Mobile-first** responsive design

## 🔒 Security Considerations

### Template Security:

- ✅ **No sensitive data** in templates
- ✅ **HTTPS links** only
- ✅ **Expiration notices** for security
- ✅ **Clear unsubscribe** options

### User Privacy:

- ✅ **GDPR compliant** footer
- ✅ **Clear purpose** statements
- ✅ **Easy opt-out** mechanisms

## 📊 Analytics & Tracking

### Optional Additions:

```html
<!-- Add tracking pixel if needed -->
<img
  src="https://yourdomain.com/track/email-open"
  width="1"
  height="1"
  style="display:none;"
/>
```

### Link Tracking:

```html
<!-- Wrap links for tracking -->
<a
  href="{{ .ConfirmationURL }}"
  class="cta-button"
  data-track="email-confirmation"
>
  Confirm Your Email Address
</a>
```

## 🚀 Next Steps

1. **Configure** the template in Supabase
2. **Test** with real email addresses
3. **Monitor** delivery rates and open rates
4. **Iterate** based on user feedback
5. **Create additional templates** for:
   - Password reset
   - Email change confirmation
   - Welcome series
   - Onboarding emails

---

**Last Updated**: July 18, 2024
**Version**: 1.0.0
**Status**: Ready for production
