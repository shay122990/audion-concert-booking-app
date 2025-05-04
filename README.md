---
# Audion 🎶 – Concert & Event Booking Platform

Welcome to **Audion** – your ultimate platform for browsing, booking, and managing tickets for live concerts, festivals, and events!

Audion offers users a **seamless ticket booking experience** while providing **admins** with full control over event management.
---

## 🌟 Features

### 1. Home Page – Featured Events

- Browse top upcoming events with beautiful banners.
- Search by event name or category.
- ✨ _\[Image coming soon]_

### 2. Event Categories

- Filter events by categories like EDM, Rock, Jazz, Classical, Festivals, and more.
- Responsive grid for easy browsing.
- ✨ _\[Image coming soon]_

### 3. Event Details Page

- See event title, description, lineup, date options, venue, and ticket prices.
- Select your event date and time.
- ✨ _\[Image coming soon]_

### 4. Booking Confirmation Flow

- Secure your tickets by logging in and filling your booking info.
- View a **Booking Summary** before payment.
- ✨ _\[Image coming soon]_

### 5. Payment Integration

- Stripe-powered checkout for secure payments.
- Displays ticket quantity, price breakdown, and total amount.
- ✨ _\[Image coming soon]_

### 6. User Dashboard – My Bookings

- Logged-in users can view their upcoming bookings.
- See event details, booking date, quantity of tickets, and amount paid.
- ✨ _\[Image coming soon]_

### 7. Admin Panel

- Upload new events manually or via mock data.
- Edit event details or delete all events or a single event.
- Upload includes event image, category, multiple dates, doors open time, start/end times, price, lineup, and description.
- ✨ _\[Image coming coon]_

### 8. Authentication

- Sign In via Google Auth (Firebase Auth).
- ✨ _\[Image coming coon]_

### 9. Role-Based Access

- Admin dashboard access restricted to approved admin accounts.
- Role stored in Firebase under each user document.
- ✨ _\[Image coming coon]_

### 10. Fully Responsive

- Optimized for mobile, tablet, and desktop.
- Smooth transitions and mobile-friendly layout.
- ✨ _\[Image coming coon]_

---

## 🛠️ Built With

- **Next.js 14** (App Router)
- **TypeScript**
- **Firebase** (Auth, Firestore)
- **Stripe** (Payment processing)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Vercel** (Deployment)

---

## 🚀 Running Locally

1. Clone the repository:

```bash
git clone https://github.com/your-username/audion.git
```

2. Install dependencies:

```bash
npm install
```

3. Set up your `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Start the development server:

```bash
npm run dev
```

Your app should be running on [http://localhost:3000](http://localhost:3000)! 🎉

---
