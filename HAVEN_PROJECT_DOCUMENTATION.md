# Haven — Rental Property Discovery & Marketplace Platform

### Brand Positioning & Identity
- **Brand Name**: Haven
- **Tagline**: *Rent. List. Connect.*
- **Positioning**: A modern rental property discovery platform connecting tenants directly with verified brokers.
- **Brand Palette**:
  - **Primary Emerald Green**: `#083D2E`
  - **Warm Gold**: `#D4A64A`
  - **Off-white Background**: `#F8F8F8`
  - **Supporting Neutrals & Success Accents**: Slate borders, Emerald `#10B981` success badges, and refined typography.
- **Typography**: Clean Poppins geometric sans-serif (Bold for headings, Medium for labels, Regular for body).

---

## 1. Summary of Completed Features

### 🌟 Public Marketplace Website
1. **Premium Navigation & Brand Identity**:
   - Modern Haven house icon badge with golden accent dot and responsive navigation.
   - Quick role switcher, saved property counter badge, and mobile drawer.
2. **Dynamic Hero Search Engine**:
   - Real-time location search (Kozhikode, Ramanattukara, Feroke, Kochi, Malappuram, Tirur, Bengaluru).
   - Category filtering (Hostels, PG Accommodations, Shared Rooms, Private Rooms, Flats, Apartments, Houses).
   - Monthly budget selector (from under ₹5,000 to luxury stays).
3. **Accommodation Categories Showcase**:
   - 7 distinct accommodation category cards with live property count indicators and direct filtered links.
4. **Curated & Featured Listings Grid**:
   - Realistic photography, monthly rent in tabular figures, occupancy tags, verified broker badges, and optimistic save/heart toggling with undo toasts.
5. **Direct ₹49 Broker Contact Value Proposition Section**:
   - Comprehensive explanation of the platform's anti-exploitation model: zero tenant brokerage, direct WhatsApp connect, and verified phone numbers for a single ₹49 micro-fee.
6. **Popular Location Hubs & Broker Onboarding CTA**:
   - Visual destination cards for Calicut, Kochi Infopark, and Bengaluru Tech corridor.
   - Broker call-to-action banner for property managers.

---

### 🔍 Property Exploration & Search (`/explore`)
- **Full-Spectrum Filter Sidebar**:
  - Search by title, locality, or landmark.
  - Category selectors.
  - Dual rent slider up to ₹1,00,000/month.
  - Gender preference (Boys only, Girls only, Family, Any/Co-Living).
  - Occupancy type (Single, Double, Triple, Four-person, Entire place).
  - Furnishing status (Furnished, Semi-Furnished, Unfurnished).
  - Multi-select amenities filter (Wi-Fi, Food, AC, Parking, CCTV, Power Backup, Laundry, Drinking Water, Housekeeping, Elevator).
- **Sort Options**: Newest, Price (Low to High), Price (High to Low), and Popularity.
- **Interactive UI**: Active filter tags with one-click dismissal, result counters, empty states with reset recommendations, and mobile bottom sheet drawer.

---

### 🏡 Property Details & Verified Broker Unlock (`/property/:id`)
- **Interactive Multi-Photo Gallery**:
  - Main hero cover image, thumbnail navigation, previous/next controls, and full-screen gallery modal.
- **Structured Specifications**:
  - Monthly rent, security deposit, maintenance fees, and availability date.
  - Dedicated **Hostel & PG Policies section**: 3-meals food inclusion, dietary type (Veg/Non-Veg), gate curfew time, and check-in rules.
  - Interactive amenities tags and house rules.
  - Neighborhood preview with static map illustration.
- **Verified Broker Profile**:
  - Agency credentials, experience, rating (★ 4.9), and verified broker badge.
- **Protected Contact Information**:
  - Phone and WhatsApp handles are masked by default.
  - Prominent "Unlock Broker Contact (₹49)" call-to-action.
  - Revealed state with direct `tel:` dialing and pre-filled WhatsApp click-to-chat (`https://wa.me/...`).

---

### 💳 Simulated ₹49 Payment Gateway
- **Checkout Modal**:
  - Property summary, broker identification, and ₹49 fee confirmation.
- **Demo Payment Channels**:
  - **UPI / GPay / PhonePe / BHIM**: Custom demo VPA input.
  - **Debit / Credit Card**: Demonstration card details with CVV and expiry validation.
  - **Net Banking**: Demonstration selection across major Indian banks (SBI, HDFC, ICICI, Federal Bank).
- **Gateway Simulation & State Machine**:
  - Simulated bank processing with loading spinners.
  - **Failure Simulation Toggle**: Ability to trigger a mock bank decline to verify that contacts remain locked on error.
  - **Success Screen**: Confirms unique Transaction ID (e.g., `HVN-TXN-61479`), timestamp, and reveals the broker's direct phone number.
  - **Idempotency Protection**: Repeated clicks while processing are blocked to prevent duplicate transaction registration.

---

### 👤 Tenant Dashboard (`/user/*`)
- **Overview (`/user/dashboard`)**:
  - Welcome banner, saved stays summary, unlocked broker contacts preview, and recent transactions.
- **Saved Properties (`/user/saved`)**:
  - Bookmark and manage favorite listings with persistent LocalStorage state.
- **Unlocked Contacts (`/user/unlocked`)**:
  - Complete list of properties unlocked via ₹49 payment, displaying direct phone numbers, "Call Now", and "WhatsApp" buttons.
- **Payment History (`/user/payments`)**:
  - Full receipt ledger with Transaction ID, property title, payment method, date, status, and direct link to listing.
- **Profile & Settings (`/user/profile`, `/user/settings`)**:
  - Update personal info, budget, and preferred city.
  - **Reset Demo Data** tool to restore factory seed state.

---

### 🏢 Broker Desk & Property Management (`/broker/*`)
- **Portfolio Overview (`/broker/dashboard`)**:
  - Key metrics: Total Listings, Active/Live, Rented Out, Property Views, Contact Unlocks, and Simulated Earnings.
  - **Visual Analytics with Recharts**:
    1. *Listing Engagement Chart*: Views vs. Unlocks per listed stay.
    2. *Unlock Growth Trend Area Chart*: Monthly contact unlock volume.
- **My Listings (`/broker/listings`)**:
  - Filter by status: All, Published, Rented, Paused, Draft.
  - Inline availability & status toggle (instantly mark a property as "Rented" or re-publish it).
  - Duplicate listing action (creates an editable Draft copy).
  - Delete and Edit controls.
- **Multi-Step Add Property Wizard (`/broker/listings/new`)**:
  - Step 1: Basic Information (Title, category, description).
  - Step 2: Location (State, city, locality, address, landmark).
  - Step 3: Pricing (Rent, security deposit, maintenance).
  - Step 4: Specs & Hostel Policies (Food, curfew, occupancy, furnishing, gender).
  - Step 5: Amenities multi-selector.
  - Step 6: Photos & IndexedDB binary upload with Cover photo selector.
  - Step 7: Final review and live publishing to marketplace.
- **Contact Unlocks & Leads (`/broker/unlocks`)**:
  - Real-time inquiry feed showing tenants who unlocked the broker's contact details, transaction IDs, and channel.
- **Earnings & Payouts (`/broker/earnings`)**:
  - Revenue breakdown from ₹49 connection fees with 0% platform commission model.

---

## 2. Demo Login Credentials

The application provides quick demo login buttons on the sign-in page and navbar:

| Role | Email | Password | Predefined Persona |
| :--- | :--- | :--- | :--- |
| **Tenant** | `user@haven.demo` | `Demo@123` | **Rahul Nair** (Student / Techie seeking Kozhikode stays) |
| **Broker** | `broker@haven.demo` | `Demo@123` | **Muhammed Nihal** (Malabar Living & PG Hub, 6 listings) |

*Note: Any email containing the word `broker` automatically signs in as a Broker, while other emails sign in as Tenants.*

---

## 3. Technology Stack & Installed Dependencies

- **Core Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, CSS variables for design tokens (`#083D2E` primary, `#D4A64A` gold, `#F8F8F8` offwhite)
- **Routing**: `react-router-dom` with role-based `ProtectedRoute` guards
- **State Management**: Zustand with `persist` middleware
- **Data Persistence**: LocalStorage for state & preferences; IndexedDB (`idb`) for uploaded photo binaries
- **Icons**: `lucide-react`
- **Notifications**: `sonner` (toast notifications with undo actions)
- **Analytics Charts**: `recharts` (ResponsiveContainer, BarChart, AreaChart)

---

## 4. Application Route Structure

```
Public Routes:
├── /                               (Landing page with search, categories, featured stays)
├── /explore                        (Full exploration with multi-facet filters & sort)
├── /property/:id                   (Property gallery, specs, broker profile & ₹49 unlock)
├── /login                          (Demo sign-in with instant persona buttons)
├── /register                       (Tenant & Broker registration)
├── /privacy-policy                 (Privacy & ₹49 protection terms)
├── /terms                          (Platform terms and conditions)
└── /404                            (Custom 404 page)

Tenant Routes (Role: tenant):
├── /user/dashboard                 (Tenant overview & quick actions)
├── /user/saved                     (Saved / bookmarked properties)
├── /user/unlocked                  (Unlocked broker contacts & WhatsApp actions)
├── /user/payments                  (Transaction ledger)
├── /user/profile                   (Tenant profile & search preferences)
└── /user/settings                  (Reset demo data)

Broker Routes (Role: broker):
├── /broker/dashboard               (Overview & Recharts engagement analytics)
├── /broker/listings                (Portfolio management, status change, duplication)
├── /broker/listings/new            (7-step property onboarding wizard)
├── /broker/listings/:id/edit       (Edit specifications, rent, and status)
├── /broker/unlocks                 (Tenant inquiries & lead generation feed)
├── /broker/earnings                (Unlock fees & settlement breakdown)
├── /broker/profile                 (Agency credentials & verification badge)
└── /broker/settings                (Environment & persistence settings)
```

---

## 5. Storage Architecture: Client Simulation vs. Future Backend

### Currently Simulated in Browser
1. **Authentication**: Client-side role persistence in LocalStorage (`haven_auth_session`).
2. **Property Inventory**: Seeded with 15+ realistic properties across Kozhikode, Ramanattukara, Feroke, Kochi, Malappuram, Tirur, and Bengaluru. New properties created by brokers persist across page reloads via LocalStorage (`haven_properties_store`).
3. **Uploaded Images**: Stored as base64 DataURLs in browser **IndexedDB** (`haven_image_store`), ensuring that broker-uploaded pictures remain available after browser refreshes.
4. **₹49 Payment Processing**: Client-side asynchronous simulation generating formatted transaction IDs, recording idempotent receipts, and tracking leads.
5. **Contact Unlocks & Favourites**: Stored in LocalStorage (`haven_payment_store`, `haven_user_preferences`).

### Future Backend Integration Roadmap
When transitioning from this MVP to production:
1. **Database & ORM**: Connect to **Neon PostgreSQL** using **Prisma** to persist users, properties, and transactions.
2. **Authentication**: Replace client mock auth with **Clerk** or **Better Auth** with JWT session cookies and role-based permissions.
3. **Media Storage**: Replace IndexedDB with **Cloudflare R2** or **AWS S3** for signed image uploads and CDN delivery.
4. **Payment Gateway**: Replace simulated processor with **Razorpay Orders & Webhooks** to cryptographically verify ₹49 payments on the server before unlocking phone numbers.
5. **Security & Authorization**: Ensure that production APIs never return raw broker phone numbers to unauthenticated users prior to database transaction verification.
