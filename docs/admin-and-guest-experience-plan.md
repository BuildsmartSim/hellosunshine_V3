# Admin Security & UI Overhaul (including Guest Experience)

This plan outlines the steps to secure the Hello Sunshine Admin panel, introduce role-based access, and improve the management interface for events and refunds. It also includes the Phase 1 strategy for a guest-facing interactive dashboard.

## User Review Required

> [!IMPORTANT]
> **Authentication Method**: We will use Supabase Auth for the admin login. You will need to create an admin user in your Supabase Dashboard (Authentication -> Users).

> [!CAUTION]
> **Role Management**: Initial roles will be assigned via a simple mapping in the database. I will provide a SQL script to set up a `user_roles` table.

## Proposed Changes

### [Authentication & Security]

#### [NEW] [login/page.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/login/page.tsx)
- Implementation of a clean, branded login screen for admins and staff.

#### [MODIFY] [middleware.ts](file:///c:/prog/Hellosunshine_V2/src/middleware.ts)
- Protection of all `/admin` routes (except `/admin/login`) to require an authenticated session.

#### [NEW] [admin_config.sql](file:///c:/prog/Hellosunshine_V2/supabase/migrations/20260226_admin_config.sql)
- SQL to create `user_roles` table for access control.
- **[NEW]** SQL to create `admin_settings` table for storing Chief's email, Telegram Bot Token, and Chat ID.

---

### [UI & Navigation]

#### [MODIFY] [layout.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/layout.tsx)
- Rebuilding the layout to include a sidebar for better navigation.
- **[NEW]** Add "Chief Settings" link (Gated to Admin only).

#### [NEW] [settings/page.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/settings/page.tsx)
- Implementation of the Chief's configuration panel for Email and Telegram credentials.

#### [MODIFY] [page.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/page.tsx)
- Cleaning up the dashboard to only show high-level stats.
- Moving the "Event Manager" table to its own section or gating it behind admin roles.

---

### [Refunds Management]

#### [NEW] [refunds/page.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/refunds/page.tsx)
- A dedicated area for managing refunds.
- Interface to select a ticket and provide a **Reason for Refund**.

#### [MODIFY] [tickets.ts](file:///c:/prog/Hellosunshine_V2/src/app/actions/tickets.ts)
- Updating `refundTicketAction` to accept and store a `reason`.
- **[NEW]** Trigger Email AND Telegram alerts for refunds if configured.

#### [NEW] [summary/route.ts](file:///c:/prog/Hellosunshine_V2/src/app/api/cron/daily-summary/route.ts)
- API route for triggering a daily sales summary via Telegram (can be called by a Vercel Cron).

#### [MODIFY] [schema_setup.sql](file:///c:/prog/Hellosunshine_V2/schema_setup.sql)
- Adding `refund_reason` column to the `tickets` table.
- **[NEW]** Adding `checked_in_at` (TIMESTAMPTZ) and `check_in_notes` (TEXT) to the `tickets` table.

---

### [Entry Scanner]

#### [NEW] [scanner/page.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/scanner/page.tsx)
- Mobile-optimized QR scanner interface using `html5-qrcode`.
- Real-time feedback for success, already scanned, or invalid tickets.

#### [NEW] [scanner/ScannerClient.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/scanner/ScannerClient.tsx)
- Client-side logic for camera handling and sound/haptic feedback.

#### [MODIFY] [tickets.ts](file:///c:/prog/Hellosunshine_V2/src/app/actions/tickets.ts)
- **[NEW]** Add `checkInTicketAction` to validate and mark tickets as scanned.

---

### [Admin UI Refinement]

#### [MODIFY] [Sidebar.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/Sidebar.tsx)
- Restore **Socials** link.
- Add mobile toggle state and "Hamburger" button for mobile users.
- Update styles to be `fixed` on mobile and `sticky` on desktop.

#### [MODIFY] [layout.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/layout.tsx)
- Update layout to handle the mobile sidebar overlay.
- Ensure main content area is properly padded on mobile.

#### [MODIFY] [ScannerClient.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/scanner/ScannerClient.tsx)
- Adjust height and padding for better fit on small mobile screens.
- Ensure camera viewport is always visible.

---

### [Admin Settings Fix]

#### [MODIFY] [tickets.ts](file:///c:/prog/Hellosunshine_V2/src/app/actions/tickets.ts)
- **[NEW]** Add `updateSettingsAction` using `supabaseAdmin` to bypass RLS.

#### [MODIFY] [settings/page.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/settings/page.tsx)
- Use `supabaseAdmin` for initial settings fetch.

#### [MODIFY] [AdminSettingsManager.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/settings/AdminSettingsManager.tsx)
- Call `updateSettingsAction` on save instead of client-side update.
- Improve UI feedback and error handling.

---

### [Guest Experience]

#### [NEW] [dashboard/page.tsx](file:///c:/prog/Hellosunshine_V2/src/app/tickets/%5Bid%5D/dashboard/page.tsx)
- A highly visual, mobile-first dashboard for ticket holders.
- **Time-Limited Access**: Logic to verify that the current date is within the event window + 72 hours.
- **Busyness Meter**: Real-time indicator showing current attendance relative to event capacity.
- **Social Workstation**: Simplified version of the social tool for guests to create branded posts.

#### [NEW] [guest_posts.sql](file:///c:/prog/Hellosunshine_V2/supabase/migrations/20260226_guest_posts.sql)
- Table for storing guest-created posts with a `status` (pending/approved).

#### [MODIFY] [social/page.tsx](file:///c:/prog/Hellosunshine_V2/src/app/admin/social/page.tsx)
- Add an "Approval Queue" section for admins to review and publish guest posts.

#### [MODIFY] [tickets.ts](file:///c:/prog/Hellosunshine_V2/src/app/actions/tickets.ts)
- Add `getGuestDashboardData` to fetch attendance and event info securely.
- **[NEW]** Add `validateGuestAccess` helper to check if the ticket is still "active" based on event date.
- Add `submitGuestPostAction` to save pending social posts.

## Verification Plan

### Automated Tests
- Verification that `/admin` redirects to `/admin/login` for unauthenticated users.
- Verification that a `clerk` user cannot access `/admin/events/new`.

### Manual Verification
1. **Login Flow**: Log in as an admin and verify access to all sections.
2. **Refund Process**: Process a refund, providing a reason, and verify it is saved in the database.
3. **Role Gating**: Attempt to access the API settings as a clerk and ensure it is hidden or blocked.
