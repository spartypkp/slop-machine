# Slop Machine Implementation Plan

## Project Overview
A NextJS web application that combines slot machine mechanics with mad libs to generate creative prompts for AI video generation. The focus is on creating an engaging, fun UI/UX experience with smooth animations and satisfying interactions.

## Tech Stack
- **Frontend**: NextJS 14+ (App Router)
- **UI Components**: ShadCN/UI
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand (lightweight) or React Context
- **Icons**: Lucide React

## Core Features

### 1. Slop Machine Interface
- **3 Spinning Wheels**: Each wheel contains different categories of mad lib elements
- **Spin Mechanism**: Single button to spin all wheels or individual wheel controls
- **Result Display**: Clear presentation of the generated combination
- **History**: Keep track of previous generations

### 2. Wheel Categories
- **Wheel 1 - Characters/Subjects**: "A confused penguin", "An overconfident AI", "A time-traveling barista"
- **Wheel 2 - Actions/Scenarios**: "trying to solve climate change", "hosting a cooking show", "running for president"
- **Wheel 3 - Settings/Contexts**: "in a zero-gravity disco", "during an alien invasion", "inside a giant snow globe"

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
├── components/
│   ├── ui/ (ShadCN components)
│   ├── slop-machine/
│   │   ├── SlopMachine.tsx
│   │   ├── SpinWheel.tsx
│   │   ├── WheelItem.tsx
│   │   ├── ResultDisplay.tsx
│   │   ├── SpinButton.tsx
│   │   └── GenerationHistory.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── effects/
│       ├── Confetti.tsx
│       └── SoundEffects.tsx
├── lib/
│   ├── data/
│   │   ├── wheel-content.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useSpinAnimation.ts
│   │   ├── useLocalStorage.ts
│   │   └── useSoundEffects.ts
│   └── utils/
│       ├── animations.ts
│       └── random.ts
├── types/
│   └── slop-machine.ts
└── styles/
    └── components.css
```

## Component Architecture

### SlopMachine (Main Container)
```tsx
interface SlopMachineProps {
  onGenerate: (result: GenerationResult) => void;
}
```
- Orchestrates the entire machine
- Manages global state (spinning, results)
- Handles the main spin logic
- Integrates with backend API

### SpinWheel
```tsx
interface SpinWheelProps {
  wheelId: string;
  items: string[];
  isSpinning: boolean;
  finalIndex?: number;
  onSpinComplete: (result: string) => void;
}
```
- Individual wheel component with smooth CSS/Framer Motion animations
- Randomized spin duration and easing
- Visual feedback during spinning
- Momentum-based stopping animation

### ResultDisplay
```tsx
interface ResultDisplayProps {
  character: string;
  action: string;
  setting: string;
  isVisible: boolean;
}
```
- Animated reveal of the final combination
- Copy-to-clipboard functionality
- "Generate Video" button integration
- Social sharing options

## UI/UX Design Specifications

### Visual Design
- **Color Scheme**: 
  - Primary: Vibrant gradient (purple to pink to orange)
  - Secondary: Dark background with neon accents
  - Accent: Electric blue for highlights
- **Typography**: 
  - Headers: Bold, playful font (consider Inter Black or similar)
  - Body: Clean, readable (Inter Regular)
  - Wheel text: Medium weight for readability while spinning

### Animations & Interactions

#### Spin Animation
```css
/* Wheel spinning physics */
.wheel-spinning {
  animation: spin-wheel 3s cubic-bezier(0.17, 0.67, 0.12, 0.99);
}

@keyframes spin-wheel {
  from { transform: rotate(0deg); }
  to { transform: rotate(1800deg); /* 5 full rotations */}
}
```

#### Micro-interactions
- **Hover effects** on spin button with slight scale and glow
- **Satisfying click** with haptic feedback (if supported)
- **Wheel bobbing** animation when idle
- **Particle effects** on successful generation
- **Sound effects** for spins and results (optional toggle)

#### Loading States
- Skeleton loading for initial wheel content
- Shimmer effect on spinning wheels
- Progressive disclosure of results

### Responsive Design
- **Desktop**: Full 3-wheel layout with large spin button
- **Tablet**: Stacked wheels with optimized spacing
- **Mobile**: Vertical layout with swipe gestures support

## Data Structure

### Wheel Content
```typescript
interface WheelCategory {
  id: string;
  name: string;
  emoji: string;
  items: WheelItem[];
}

interface WheelItem {
  id: string;
  text: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  weight: number; // for weighted randomization
}

interface GenerationResult {
  id: string;
  timestamp: Date;
  character: WheelItem;
  action: WheelItem;
  setting: WheelItem;
  combinedPrompt: string;
}
```

### Sample Content Structure
```typescript
export const wheelData: WheelCategory[] = [
  {
    id: 'characters',
    name: 'Characters',
    emoji: '🎭',
    items: [
      { id: 'c1', text: 'A confused penguin', rarity: 'common', weight: 10 },
      { id: 'c2', text: 'An overconfident AI', rarity: 'uncommon', weight: 7 },
      { id: 'c3', text: 'A time-traveling barista', rarity: 'rare', weight: 3 },
      // ... more items
    ]
  },
  // ... other categories
];
```

## Key Implementation Features

### 1. Advanced Spinning Logic
- **Weighted randomization** for different rarity items
- **Anti-repetition system** to avoid consecutive duplicates
- **Momentum simulation** for realistic stopping
- **Configurable spin duration** based on excitement level

### 2. Gamification Elements
- **Rarity system** with visual indicators (colors, sparkles)
- **Combo tracking** for interesting combinations
- **Achievement badges** for milestones
- **Shareable results** with custom graphics

### 3. Accessibility
- **Keyboard navigation** for all interactions
- **Screen reader support** with proper ARIA labels
- **Reduced motion** option for accessibility
- **High contrast mode** support

### 4. Performance Optimizations
- **Virtual scrolling** for large wheel content
- **Optimized animations** with CSS transforms
- **Image lazy loading** for result previews
- **Service worker** for offline capability

## Integration Points

### Backend API Endpoints
```typescript
// For your AI backend integration
interface APIEndpoints {
  '/api/generate-video': {
    method: 'POST';
    body: { prompt: string; options?: VideoOptions };
    response: { jobId: string; estimatedTime: number };
  };
  
  '/api/job-status': {
    method: 'GET';
    params: { jobId: string };
    response: { status: 'pending' | 'processing' | 'complete' | 'error'; videoUrl?: string };
  };
}
```

### State Management
```typescript
interface SlopMachineState {
  wheels: {
    character: { isSpinning: boolean; selectedItem: WheelItem | null };
    action: { isSpinning: boolean; selectedItem: WheelItem | null };
    setting: { isSpinning: boolean; selectedItem: WheelItem | null };
  };
  generationHistory: GenerationResult[];
  currentGeneration: GenerationResult | null;
  isGeneratingVideo: boolean;
  videoJobs: Record<string, VideoJob>;
}
```

## Development Phases

### Phase 1: Core Functionality (Week 1)
- Set up NextJS project with ShadCN and Tailwind
- Create basic wheel components
- Implement simple spin logic
- Basic result display

### Phase 2: Enhanced UX (Week 2)
- Add smooth animations with Framer Motion
- Implement rarity system and visual feedback
- Add sound effects and haptic feedback
- Responsive design implementation

### Phase 3: Polish & Integration (Week 3)
- Connect to your AI backend
- Add generation history and favorites
- Implement sharing functionality
- Performance optimization and testing

### Phase 4: Advanced Features (Week 4)
- Gamification elements
- Advanced animations and effects
- Accessibility improvements
- Analytics integration

## Performance Considerations

### Animation Performance
- Use `transform` and `opacity` only for animations
- Implement `will-change` CSS property for spinning elements
- Consider `useCallback` and `useMemo` for expensive operations
- Debounce rapid spin requests

### Bundle Optimization
- Dynamic imports for heavy components
- Tree-shake unused ShadCN components
- Optimize wheel content data structure
- Implement proper image optimization

## Testing Strategy

### Unit Testing
- Test wheel randomization logic
- Validate state management
- Component rendering tests

### Integration Testing
- End-to-end spin workflows
- API integration testing
- Cross-browser compatibility

### Performance Testing
- Animation smoothness across devices
- Memory usage during extended use
- Network request optimization

## Future Enhancements

### Advanced Features
- **Custom wheel creation** by users
- **Themed wheel sets** (horror, comedy, sci-fi)
- **Collaborative spinning** with friends
- **AI-suggested combinations** based on trending topics
- **Video result gallery** with community features

### Technical Improvements
- **Progressive Web App** features
- **Real-time multiplayer** spinning
- **Advanced analytics** dashboard
- **A/B testing** framework for UI improvements

## Conclusion

This implementation plan provides a solid foundation for creating an engaging, polished slop machine application. The focus on smooth animations, satisfying interactions, and clean architecture will ensure a delightful user experience that encourages repeated use and sharing.

The modular component structure allows for easy iteration and feature additions, while the backend integration points provide clear boundaries for your AI video generation system.