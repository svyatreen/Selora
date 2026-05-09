// Extended hotel and room types for the new fields returned by the API.
// These are extensions of the orval-generated types.

export type HotelExtensions = {
  amenitiesExtended?: Record<string, string[]> | null;
  languages?: string[] | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  earlyCheckIn?: { available: boolean; fee: number; currency?: string } | null;
  lateCheckOut?: { available: boolean; fee: number; currency?: string } | null;
  parking?: {
    available: boolean;
    free: boolean;
    covered: boolean;
    valet: boolean;
    price?: number;
    currency?: string;
  } | null;
  accessibility?: {
    wheelchairAccessible: boolean;
    elevator: boolean;
    rampedEntrance: boolean;
    accessibleRooms: boolean;
    brailleSignage: boolean;
    hearingAssistance: boolean;
  } | null;
  petPolicy?: {
    allowed: boolean;
    maxWeightKg?: number;
    fee?: number;
    restrictions?: string;
  } | null;
  childPolicy?: {
    allowed: boolean;
    ageGroups: Array<{
      from: number;
      to: number;
      pricing: 'free' | 'reduced' | 'full';
    }>;
  } | null;
  paymentMethods?: string[] | null;
  popularBadge?: string | null;
  includedInPrice?: string[] | null;
  notIncluded?: string[] | null;
  keyDistances?: Array<{
    type: string;
    nameRu: string;
    nameEn: string;
    distanceKm: number;
    durationWalkMin?: number | null;
    durationDriveMin?: number | null;
  }> | null;
};

export type RoomExtensions = {
  sizeSqm?: number | null;
  floor?: string | null;
  viewType?: string | null;
  bedConfiguration?: Array<{ type: string; count: number }> | null;
  bathType?: string | null;
  soundproofing?: boolean | null;
  nonSmoking?: boolean | null;
  amenitiesDetailed?: Record<string, string[]> | null;
  freeItems?: string[] | null;
};

export type RatePlan = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  priceModifier: number;
  pricePerNight: number;
  refundable: boolean;
  includesBreakfast: boolean;
  includesDinner: boolean;
  freeCancellationHours?: number | null;
  lateCheckoutIncluded: boolean;
};

export type BookingAddon = {
  id: number;
  code: string;
  hotelId: number | null;
  name: string;
  description?: string | null;
  icon?: string | null;
  category: string;
  price: number;
  unit: 'per_booking' | 'per_night' | 'per_guest' | 'per_hour';
  maxQuantity: number;
};

export type NearbyPlace = {
  osmId: number;
  type: string;
  category: string;
  name: string;
  nameRu?: string | null;
  nameEn?: string | null;
  cuisine?: string | null;
  opening_hours?: string | null;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
  latitude: number;
  longitude: number;
  distanceKm: number;
  walkMinutes: number;
};

export type NearbyResponse = {
  center: { latitude: number; longitude: number };
  radius: number;
  category: string;
  places: NearbyPlace[];
  cached: boolean;
};
