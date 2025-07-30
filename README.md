# Artist Battle Platform - Updated

A dynamic artist battle platform where users can vote for their favorite artists and support them with donations.

## Recent Updates

### ✅ Removed Hardcoded Data
- **Store**: Removed all hardcoded artist and battle data from `stores/app-store.ts`
- **Dynamic Loading**: Added `loadArtists()` and `loadCurrentBattle()` functions
- **Data Service**: Created `lib/data-service.ts` for API integration
- **Loading States**: Added proper loading and error states throughout the app

### ✅ Removed Yellow Colors
- **Artist Card**: Replaced yellow gradient with indigo-purple gradient for featured artists
- **Global Styles**: Updated color scheme to remove yellow tones
- **Consistent Theme**: All UI elements now use a cohesive color palette

### ✅ Name Required (No Anonymous)
- **Intro Modal**: Users must provide their name and email before participating
- **Donation Modal**: Name and email are required fields (marked with *)
- **User Creation**: Automatic user creation when first interacting with the platform
- **Validation**: Proper form validation for required fields

### ✅ Nice Intro Modal
- **Welcome Screen**: Beautiful intro modal with platform features
- **User Onboarding**: Collects user information before allowing participation
- **Feature Highlights**: Shows voting, donations, and battle tracking features
- **Smooth UX**: Seamless transition from intro to main platform

### ✅ Fixed Voting System
- **Multiple Votes**: Users can now vote twice for each artist (upvote + downvote)
- **Vote Tracking**: Proper tracking of individual vote types per artist
- **User Authentication**: Requires user login before voting
- **Real-time Updates**: Vote counts update immediately

### ✅ Angular UI (No Rounded Corners)
- **Global CSS**: Set `--radius: 0` to remove all rounded corners
- **Components**: Updated all components to use angular styling
- **Consistent Design**: All buttons, cards, and modals now have sharp corners
- **Modern Look**: Clean, angular design throughout the platform

## Features

### 🎵 Artist Battles
- Dynamic artist loading from API
- Real-time battle statistics
- Countdown timer for battle end
- Battle status tracking

### 🗳️ Voting System
- Upvote and downvote for each artist
- Multiple votes allowed per artist
- Real-time vote counting
- User vote history tracking

### 💰 Donation System
- M-Pesa and Pesapal payment integration
- Required user information
- Donation tracking and history
- Real-time donation statistics

### 👤 User Management
- User registration via intro modal
- User profile tracking
- Vote and donation history
- Personalized experience

## Technical Stack

- **Framework**: Next.js 14 with TypeScript
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Custom component library
- **Payment**: PayHero integration (M-Pesa & Pesapal)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Configure your PayHero API keys
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Load Sample Data**
   - Click the "Load Sample Data" button in the bottom-right corner
   - This will populate the platform with sample artists and battles

## API Integration

The platform is designed to work with your backend API. Update the `DataService` class in `lib/data-service.ts` to connect to your actual API endpoints:

```typescript
static async loadArtists(): Promise<Artist[]> {
  const response = await fetch('/api/artists')
  return response.json()
}

static async loadCurrentBattle(): Promise<Battle | null> {
  const response = await fetch('/api/battles/current')
  return response.json()
}
```

## File Structure

```
├── app/
│   └── page.tsx                 # Main application page
├── components/
│   ├── admin-panel.tsx          # Sample data loader
│   ├── artist-comparison.tsx    # Artist battle interface
│   ├── donation-modal.tsx       # Donation form
│   ├── intro-modal.tsx          # User onboarding
│   └── ui/                      # Reusable UI components
├── lib/
│   ├── data-service.ts          # API integration layer
│   └── payhero-service.ts       # Payment integration
├── stores/
│   └── app-store.ts             # Global state management
├── types/
│   └── index.ts                 # TypeScript type definitions
└── styles/
    └── globals.css              # Global styles and components
```

## Key Components

### IntroModal
- User onboarding and registration
- Required name and email collection
- Platform feature introduction

### ArtistComparison
- Main battle interface
- Voting system with multiple votes
- Artist information display
- Social media links

### DonationModal
- Payment form with validation
- M-Pesa and Pesapal integration
- Required user information
- Donation tracking

### AdminPanel
- Development tool for loading sample data
- Easy testing and demonstration

## State Management

The app uses Zustand for state management with the following key stores:

- **Artists**: Dynamic artist data
- **Current Battle**: Active battle information
- **Votes**: User voting history
- **Donations**: Donation tracking
- **Current User**: User profile and preferences
- **UI State**: Modal states and UI interactions

## Styling

- **Angular Design**: No rounded corners throughout
- **Color Scheme**: Indigo, purple, and slate colors
- **Responsive**: Mobile-first design
- **Accessibility**: Proper contrast and focus states

## Future Enhancements

- [ ] Real-time notifications
- [ ] Artist profile pages
- [ ] Battle history
- [ ] Social sharing
- [ ] Advanced analytics
- [ ] Admin dashboard
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 