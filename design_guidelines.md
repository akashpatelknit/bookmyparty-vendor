# Event Management Admin Dashboard - Design Guidelines

## Design Approach
**System**: Material Design with SaaS influence - Clean, professional admin dashboard with financial tracking capabilities
**Primary Color**: Blue
**Theme**: Light professional theme with clear hierarchy and data-rich displays

## Typography & Spacing
- **Font Stack**: System fonts (Inter/SF Pro for admin interfaces)
- **Headings**: Bold weights (600-700) for section titles and card headers
- **Body**: Regular weight (400) for data tables and content
- **Spacing Units**: Tailwind 4, 6, 8, 12 for consistent padding/margins

## Layout System
- **Sidebar Navigation**: Fixed left sidebar with icons and labels for all 11 sections (Dashboard, Messages, Wallet, Password, Orders, Contact Admin, Loans, Subscriptions, Edit Profile, Logout, Delete Account)
- **Top Navbar**: User profile, notifications, search functionality
- **Main Content**: Responsive grid layout with max-width containers
- **Card-Based Design**: Elevated cards with subtle shadows for distinct content sections

## Core Components

### 1. Dashboard Overview
- **Overview Cards** (4-column grid on desktop, stack on mobile):
  - Total Events
  - Active Events  
  - Registered Users
  - Total Revenue
  - Each card: Large number, label, small trend indicator
- **Charts Section**:
  - Monthly Revenue: Line/bar chart (full-width or 2/3 width)
  - Event Category Breakdown: Pie/donut chart (1/3 width)
- **Recent Activity Feed**: List with avatar, action description, timestamp
- **Quick Actions**: Prominent buttons for "Create Event" and "View Orders"

### 2. Messages/Inbox
- **Two-Column Layout**:
  - Left Panel (30-35% width): Conversation list with search bar at top, filters (Unread/Starred/All) as pills/tabs, unread count badges
  - Right Panel (65-70% width): Active conversation with user info header, message bubbles (sent/received styling), timestamp below each message, input box with attachment icon, emoji picker, send button
- **Mobile**: Stack panels, show conversation list first with back navigation from chat

### 3. Wallet
- **Current Balance Card**: Large prominent card at top with balance amount
- **Action Buttons**: "Add Money" and "Withdraw Money" - primary styling
- **Transaction History Table**: Columns for ID, Type, Amount (green/red based on debit/credit), Status (badge styling), Date
- **Filters**: Date range picker, transaction type dropdown
- **Optional Graph**: Small line chart showing wallet activity trend

### 4. Password Update
- **Single Card Layout**: Centered, max-width 500-600px
- **Form Fields**: Old Password, New Password, Confirm Password (all with show/hide toggle icons)
- **Password Strength Indicator**: Progress bar below New Password field (red/yellow/green)
- **Save Button**: Full-width or right-aligned primary button
- **Security Icons**: Lock icons for visual reinforcement

### 5. Orders Management
- **Search Bar**: Top of page with filters icon
- **Filters Row**: Dropdowns for Event, Status, Date Range
- **Orders Table**: Columns for Order ID, User, Event, Amount, Payment Status (badge - success/warning/danger), Event Date, Created At
- **Pagination**: Bottom of table with page numbers and prev/next
- **Order Details**: Modal or slide-in panel from right with complete order information

### 6. Contact Admin/Support
- **Two-Section Layout**:
  - Ticket Submission Form: Subject field, message textarea, file attachment button, submit button
  - Ticket History: List of tickets with status badges (Open - blue, In Progress - yellow, Closed - gray), click to expand thread view with admin responses
- **Clean Support Styling**: Soft colors, good spacing, clear status indicators

### 7. Loans
- **Loan Status Card**: Top section showing current loan status (Approved/Pending/Rejected) with appropriate badge
- **Loan Application Form**: Fields for Amount, Duration (dropdown), Purpose (textarea), submit button
- **Loan History Table**: Past loans with amount, status, dates
- **EMI Calculator Widget**: Card with sliders/inputs for amount and duration, showing calculated EMI

### 8. Subscriptions
- **Current Plan Card**: Highlight active subscription with features list
- **Pricing Tiers** (3-column grid): Basic, Pro, Enterprise cards with:
  - Price prominently displayed
  - Feature list with checkmarks
  - Upgrade/Downgrade buttons
- **Feature Comparison Table**: Below pricing cards
- **Subscription History**: Table with plan changes and billing dates
- **SaaS Styling**: Vibrant colors for premium tiers, clear CTAs

### 9. Edit Profile
- **Two-Column Layout** (desktop):
  - Left: Profile photo with upload button overlay on hover
  - Right: Form fields (Name, Email, Phone, Address)
- **Save Changes Button**: Bottom right
- **Last Updated**: Small text showing timestamp
- **Mobile**: Single column, photo at top

### 10. Logout Confirmation
- **Modal Overlay**: Centered modal with backdrop
- **Warning Icon**: Yellow/orange alert icon at top
- **Message**: "Are you sure you want to log out?"
- **Button Group**: "Cancel" (secondary) and "Logout" (primary) side by side
- **Minimal Design**: Calm, neutral colors

### 11. Delete Account
- **Warning Section**: Red/danger colored card with prominent warning icon
- **Consequences List**: Bullet points explaining data deletion
- **Password Confirmation**: Required field for verification
- **Delete Button**: Red, full-width or prominent, labeled "Permanently Delete Account"
- **Spacing**: Extra padding around danger elements

## Visual Treatment
- **Card Elevation**: Subtle shadows (shadow-sm to shadow-md)
- **Status Badges**: Rounded pills with appropriate colors (success/warning/danger/info)
- **Tables**: Alternating row colors, hover states, clean borders
- **Forms**: Consistent input heights, clear labels, inline validation
- **Charts**: Use blue primary with complementary colors for data visualization
- **Icons**: Use Heroicons or Font Awesome via CDN throughout

## Responsive Behavior
- **Desktop (lg+)**: Full sidebar, multi-column grids, side-by-side layouts
- **Tablet (md)**: Collapsible sidebar or hamburger menu, 2-column grids maximum
- **Mobile (base)**: Stack all columns, hamburger menu, full-width cards and tables with horizontal scroll if needed