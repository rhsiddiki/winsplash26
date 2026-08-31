export type OutfitTheme = 'formal' | 'casual' | 'festive';

export type StageEnvironment = 'oasis' | 'gala' | 'cyber' | 'sunset';

export type TransitionEffect = 'cube-flip' | 'warp-portal' | 'spotlight-zoom' | 'holo-dissolve' | 'stage-pan';

export type HostTransitionType = 
  | 'auto' 
  | 'curtains' 
  | 'shutter' 
  | 'watersplash' 
  | 'magic' 
  | 'squeegee' 
  | 'confetti';

export type TransitionSpeed = 'cinematic' | 'normal' | 'brisk';

export interface Presenter {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatarConfig: {
    gender: 'male' | 'female';
    skinTone: string;
    hairColor: string;
    hairStyle: 'short' | 'stylish' | 'curly' | 'bald' | 'fade';
    facialHair?: 'none' | 'beard' | 'stubble' | 'mustache';
    glasses?: boolean;
    sunglasses?: boolean;
    themeOutfit: {
      formal: {
        suitColor: string;
        shirtColor: string;
        tieColor?: string;
        accessory?: string;
      };
      casual: {
        topColor: string;
        bottomColor: string;
        topType: 'polo' | 'tshirt' | 'hoodie';
        accessory?: string;
      };
      festive: {
        costumeColor: string;
        accentColor: string;
        costumeType: 'tropical-shirt' | 'kurta-gala' | 'party-suit';
        headwear?: 'picnic-hat' | 'sunglasses-cool' | 'flower-lei';
      };
    };
  };
  speechQuote?: string;
  speechPoints?: string[];
  photoUrl?: string;
}

export interface AwardNominee {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  isWinner?: boolean;
  achievement: string;
  metric?: string;
}

export interface RetainedEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  yearsOfService: number;
  avatarUrl?: string;
  badge?: string;
}

export interface HonorableGuest {
  id: string;
  name: string;
  relation: string; // e.g. "Respected Father of MD Fakhrul Hasan"
  title: string; // e.g. "Special Honorable Guest"
  photoUrl?: string;
  quote?: string;
  blessingPoints?: string[];
  badge?: string;
  avatarConfig?: {
    gender: 'male' | 'female';
    skinTone: string;
    hairColor: string;
    hairStyle: 'short' | 'stylish' | 'curly' | 'bald' | 'fade';
    facialHair?: 'none' | 'beard' | 'stubble' | 'mustache';
    glasses?: boolean;
    attire: 'royal-sherwani' | 'panjabi-garland' | 'executive-suit';
  };
}

export interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  presenters: Presenter[];
  transitionEffect: TransitionEffect;
  speechNotes?: string[];
  honorableGuests?: HonorableGuest[];
  // Department specific properties
  metrics?: { label: string; value: string; change?: string; icon?: string }[];
  awards?: {
    type: 'top_performer' | 'retained_employees' | 'special_appreciation';
    title: string;
    nominees?: AwardNominee[];
    winner?: AwardNominee;
    retainedList?: RetainedEmployee[];
    singleCandidate?: AwardNominee;
  }[];
  customSections?: {
    title: string;
    description: string;
    tags?: string[];
    items?: string[];
    badge?: string;
  }[];
}
