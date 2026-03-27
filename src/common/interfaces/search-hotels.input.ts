export interface SearchHotelsInput {
  searchQuery?: string;
  city?: string;
  state?: string;
  country?: string;
  minRating?: number;
  maxRating?: number;
  minPrice?: number;
  maxPrice?: number;
  mealPlan?: string;
  propertyType?: string;
  amenities?: string[];
  adults?: number;
  children?: number;
  checkInDate?: string;
  checkOutDate?: string;
  limit?: number;
  offset?: number;
}
