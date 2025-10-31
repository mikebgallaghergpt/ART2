# Gallagher Art School - Code Inventory
## Actively Deployed Code vs. Discarded/Unused Code

This document provides a complete inventory of all files in the project, categorizing them as either **ACTIVELY USED** (deployed/functional) or **UNUSED** (discarded/deprecated).

---

## ✅ ACTIVELY USED FILES

### Core Application Files
1. **`/App.tsx`** - Main application entry point
   - Manages view routing between signup and admin dashboard
   - Implements lazy loading for heavy components
   - Handles responsive layout (desktop split-screen, mobile stacked)

2. **`/styles/globals.css`** - Tailwind v4 CSS configuration
   - Global design tokens and theme variables
   - Typography system
   - Light/dark mode support

### Active Components (Frontend)

#### Main Feature Components
3. **`/components/EnhancedImageCarousel.tsx`** ⭐
   - Advanced carousel with autoplay, controls, keyboard navigation
   - 5 slides showcasing art school programs
   - Touch gesture support for mobile
   - Used in both desktop and mobile layouts

4. **`/components/SignupFormOriginal.tsx`** ⭐
   - Multi-step signup form with 3 steps (Personal Info, Preferences, Account)
   - Progress indicators and validation
   - Social login placeholders (Google, Apple)
   - Newsletter subscription option
   - Supabase backend integration with localStorage fallback
   - Image-based checkboxes for interests

5. **`/components/SimpleSignupForm.tsx`** ⭐
   - Lightweight fallback signup form
   - Single-step form without heavy dependencies
   - Demo mode with localStorage storage
   - Used as alternative to SignupFormOriginal

6. **`/components/AdminDashboard.tsx`** ⭐
   - Complete admin dashboard for managing student enrollments
   - Displays students organized by art interest
   - Newsletter subscriber management
   - CSV export functionality
   - Demo mode with localStorage fallback
   - Backend health checking

#### Supporting Components
7. **`/components/figma/ImageWithFallback.tsx`** 🔒 (Protected file)
   - Image component with fallback handling
   - Used by EnhancedImageCarousel and SignupFormOriginal

### UI Components (ShadCN)
**Location:** `/components/ui/`

#### Actively Used UI Components:
8. **`button.tsx`** - Used in all main components
9. **`input.tsx`** - Used in signup forms
10. **`label.tsx`** - Used in signup forms
11. **`card.tsx`** - Used in all main components for layout
12. **`progress.tsx`** - Used in SignupFormOriginal for step progress
13. **`separator.tsx`** - Used in SignupFormOriginal for visual separation
14. **`alert.tsx`** - Used in SignupFormOriginal and AdminDashboard for errors/notifications
15. **`switch.tsx`** - Used in SignupFormOriginal for toggle controls
16. **`tabs.tsx`** - Used in AdminDashboard for content organization
17. **`badge.tsx`** - Used in AdminDashboard for counts

#### Potentially Used UI Components:
The following UI components are available and may be used indirectly:
- `checkbox.tsx`
- `select.tsx`
- And other standard ShadCN components in `/components/ui/`

### Backend/Utility Files
18. **`/utils/supabase/info.tsx`** - Supabase configuration
   - Contains project ID and anon key
   - Used by SignupFormOriginal and AdminDashboard

### Configuration Files
19. **`/package.json`** - Project dependencies and scripts
20. **`/vite.config.ts`** - Vite build configuration

### Documentation Files (Key Reference)
21. **`/README.md`** - Project overview and setup instructions
22. **`/SUPABASE_SETUP.md`** - Supabase backend setup guide
23. **`/Baby-Steps-Tutorial.md`** - Step-by-step deployment tutorial
24. **`/BACKEND_DEPLOYMENT.md`** - Backend deployment instructions
25. **`/WORDPRESS_SUPABASE_INTEGRATION.md`** - WordPress integration guide

### Backend Edge Functions
26. **`/supabase/functions/server/index.tsx`** - Main edge function handler
27. **`/supabase/functions/server/kv_store.tsx`** - Key-value store implementation

---

## ❌ UNUSED/DISCARDED FILES

### Deprecated Component Versions
These are old iterations and variations that are no longer used:

1. **`/components/SignupForm.tsx`** - Early version, replaced by SignupFormOriginal
2. **`/components/SignupFormFixed.tsx`** - Intermediate fix version
3. **`/components/SignupFormRectangular.tsx`** - Alternative layout version
4. **`/components/SignupFormWideDesktop.tsx`** - Wide desktop variation
5. **`/components/ImageCarousel.tsx`** - Basic carousel, replaced by EnhancedImageCarousel
6. **`/components/ThumbnailCarousel.tsx`** - Thumbnail-based carousel variant

### Demo/Test/Showcase Components
These were created for testing, demos, or documentation but aren't used in production:

7. **`/components/CarouselShowcase.tsx`** - Demo of carousel variations
8. **`/components/GallagherStandaloneSignup.tsx`** - Standalone version test
9. **`/components/IconCheatSheet.tsx`** - Icon reference guide
10. **`/components/IconDemo.tsx`** - Icon demonstration
11. **`/components/IconShowcase.tsx`** - Icon showcase
12. **`/components/IconTutorial.tsx`** - Icon usage tutorial
13. **`/components/SimpleIconGuide.tsx`** - Simple icon guide
14. **`/components/PaletteIcon.tsx`** - Custom palette icon component
15. **`/components/PaletteIconDemo.tsx`** - Palette icon demo
16. **`/components/ImageFallbackTest.tsx`** - Image fallback testing
17. **`/components/StudentGallery.tsx`** - Student gallery component
18. **`/debug-test.tsx`** - Debug testing file

### HTML Conversion Files
Static HTML versions created for various integration attempts:

19. **`/gallagher-art-school-corrected.html`**
20. **`/gallagher-art-school-final-corrected.html`**
21. **`/gallagher-carousel-fixed.html`**
22. **`/gallagher-complete-standalone.html`**
23. **`/gallagher-exact-conversion.html`**
24. **`/gallagher-palette-icons.html`**
25. **`/gallagher-react-conversion-complete.html`** ⚠️ (May be used for WordPress)
26. **`/gallagher-sidebyside-perfect.html`**
27. **`/gallagher-signup-standalone.html`**
28. **`/gallagher-simple-standalone.html`**
29. **`/gallagher-standalone.html`**
30. **`/gallagher-wordpress-complete.html`**
31. **`/gallagher-wordpress-signup.html`**
32. **`/gallagherartschool-signup.html`**
33. **`/flatsome-test.html`**
34. **`/wordpress-export.html`**
35. **`/wordpress-php-integration.php`**

### WordPress/Flatsome Integration Package
**Location:** `/flatsome-integration/`

This is a separate package for WordPress integration - not used in the React app but maintained for WordPress deployment:

36. **`/flatsome-integration/FLATSOME_IMPLEMENTATION_GUIDE.md`**
37. **`/flatsome-integration/FLATSOME_SETUP_INSTRUCTIONS.md`**
38. **`/flatsome-integration/QUICK_INSTALL_INSTRUCTIONS.md`**
39. **`/flatsome-integration/assets/gallagher-script.js`**
40. **`/flatsome-integration/assets/gallagher-styles.css`**
41. **`/flatsome-integration/gallagher-art-school-plugin.php`**
42. **`/flatsome-integration/gallagher-flatsome-optimized.php`**
43. **`/flatsome-integration/gallagher-flatsome-script.js`**
44. **`/flatsome-integration/gallagher-flatsome-styles.css`**
45. **`/flatsome-integration/gallagher-original-v4.2.css`**
46. **`/flatsome-integration/gallagher-original-v4.2.js`**
47. **`/flatsome-integration/gallagher-original-v4.2.php`**
48. **`/flatsome-integration/gallagher-rectangular-v4.css`**
49. **`/flatsome-integration/gallagher-rectangular-v4.js`**
50. **`/flatsome-integration/gallagher-rectangular-v4.php`**
51. **`/flatsome-integration/gallagher-single-file-v4.2.php`**

### Fixed Integration Folder
52. **`/flatsome-integration-fixed/gallagher-art-school-plugin.php`** - Alternative integration

### Package Archive Files
These appear to be ZIP file generators or archives:

53. **`/gallagher-art-school-complete_zip.tsx`**
54. **`/gallagher-art-school-enhanced-v2_zip.tsx`**

### Documentation Files (Historical/Reference)
Version history and release notes - useful for reference but not actively deployed:

55. **`/Attributions.md`** - Credits and attributions
56. **`/CHANGELOG.md`** - Change history
57. **`/PERPLEXITY_REFERENCE.md`** - External reference
58. **`/SHORTCODE-REFERENCE-v4.0.0.md`** - Shortcode documentation
59. **`/VERSION-4.0.0-RELEASE-NOTES.md`** - v4.0.0 notes
60. **`/VERSION-4.1.0-WIDE-DESKTOP-FIXES.md`** - v4.1.0 notes
61. **`/VERSION-4.2.0-COMPLETE-PACKAGE.md`** - v4.2.0 package notes
62. **`/VERSION-4.2.0-FILE-VERSIONS.md`** - v4.2.0 file versions
63. **`/VERSION-4.2.0-ORIGINAL-LAYOUT-RESTORED.md`** - v4.2.0 layout notes
64. **`/WordPress-Plugin-Package-v2.0.0.md`** - WordPress plugin docs
65. **`/deploy-instructions.md`** - Deployment notes
66. **`/guidelines/Guidelines.md`** - Development guidelines

---

## 📊 Summary Statistics

### Actively Used Files by Category:
- **Core Files:** 2 (App.tsx, globals.css)
- **Main Components:** 4 (EnhancedImageCarousel, SignupFormOriginal, SimpleSignupForm, AdminDashboard)
- **Supporting Components:** 1 (ImageWithFallback)
- **UI Components:** ~8-10 actively used from ShadCN library
- **Backend/Utility:** 3 (info.tsx, 2 edge functions)
- **Configuration:** 2 (package.json, vite.config.ts)
- **Key Documentation:** 5 essential docs

**Total Actively Used:** ~25-30 files

### Unused Files by Category:
- **Deprecated Components:** 6 files
- **Demo/Test Components:** 12 files
- **HTML Conversions:** 17 files
- **WordPress/Flatsome Package:** 16+ files (separate deployment)
- **Archive Files:** 2 files
- **Historical Documentation:** 11 files

**Total Unused in React App:** ~64+ files

---

## 🎯 Recommended Actions

### For Clean React Deployment:

**Keep:**
- All files in "ACTIVELY USED" section
- All files in `/components/ui/` (ShadCN components library)
- Key documentation: README.md, SUPABASE_SETUP.md, Baby-Steps-Tutorial.md, BACKEND_DEPLOYMENT.md

**Can Be Archived/Removed:**
- All deprecated component versions
- All demo/test/showcase components
- All HTML files (unless needed for WordPress)
- Historical documentation (keep for reference in separate docs folder)

### For WordPress Deployment:

**Keep:**
- `/flatsome-integration/` folder (entire package)
- `gallagher-react-conversion-complete.html` (if used)
- WordPress-related documentation

**Archive:**
- Old HTML conversion attempts
- Test HTML files

---

## 🔄 Migration Path to Clean Codebase

If you want a clean version with only deployed code:

1. **Create a new branch:** `git checkout -b clean-production`

2. **Remove unused components:**
   ```bash
   rm components/SignupForm*.tsx (except SignupFormOriginal.tsx)
   rm components/ImageCarousel.tsx ThumbnailCarousel.tsx
   rm components/CarouselShowcase.tsx GallagherStandaloneSignup.tsx
   rm components/Icon*.tsx Palette*.tsx
   rm components/ImageFallbackTest.tsx StudentGallery.tsx
   rm components/SimpleIconGuide.tsx
   ```

3. **Remove HTML files:**
   ```bash
   rm gallagher-*.html
   rm flatsome-test.html wordpress-*.html *.php
   ```

4. **Archive documentation:**
   ```bash
   mkdir docs-archive
   mv VERSION-*.md CHANGELOG.md Attributions.md docs-archive/
   mv deploy-instructions.md WordPress-Plugin-Package-v2.0.0.md docs-archive/
   ```

5. **Keep WordPress package separate:**
   - Move `/flatsome-integration/` to a separate repository or leave as-is for WordPress deployments

6. **Update README.md** to reflect clean structure

---

## 📁 Clean Project Structure

Here's what the clean production codebase would look like:

```
/
├── App.tsx                          ⭐ Main app
├── package.json                     ⭐ Dependencies
├── vite.config.ts                   ⭐ Build config
├── styles/
│   └── globals.css                  ⭐ Styling
├── components/
│   ├── EnhancedImageCarousel.tsx   ⭐ Carousel
│   ├── SignupFormOriginal.tsx      ⭐ Multi-step form
│   ├── SimpleSignupForm.tsx        ⭐ Simple form
│   ├── AdminDashboard.tsx          ⭐ Admin panel
│   ├── figma/
│   │   └── ImageWithFallback.tsx   ⭐ Image component
│   └── ui/                         ⭐ ShadCN components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       ├── separator.tsx
│       ├── alert.tsx
│       ├── switch.tsx
│       ├── tabs.tsx
│       ├── badge.tsx
│       └── ... (other UI components)
├── utils/
│   └── supabase/
│       └── info.tsx                 ⭐ Supabase config
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx            ⭐ Edge function
│           └── kv_store.tsx         ⭐ KV store
└── docs/                            ⭐ Essential docs
    ├── README.md
    ├── SUPABASE_SETUP.md
    ├── Baby-Steps-Tutorial.md
    └── BACKEND_DEPLOYMENT.md
```

---

## 🚀 Current Active Deployment

The current deployment uses only these files:
1. App.tsx (entry point)
2. EnhancedImageCarousel.tsx (left panel/top on mobile)
3. SignupFormOriginal.tsx (right panel/middle on mobile) OR SimpleSignupForm.tsx (fallback)
4. AdminDashboard.tsx (admin view)
5. styles/globals.css (styling)
6. UI components from /components/ui/
7. Supabase backend via /utils/supabase/info.tsx and edge functions

Everything else is either:
- Historical versions
- Test/demo code
- WordPress integration (separate deployment)
- Documentation archives

---

**Last Updated:** October 8, 2025  
**Version:** 4.2.1 Clean Code Inventory
