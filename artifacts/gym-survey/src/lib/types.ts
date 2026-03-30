export interface SurveyFormData {
  gymFrequency: string;
  experienceRating: string;
  frustrations: string[];
  frustrationsOther: string;
  gymTime: string;
  gymAnxiety: string;
  biggestChallenge: string;
  improvements: string[];
}

export interface SurveyResponse extends SurveyFormData {
  id: number;
  created_at: string;
}

export interface ResultsData {
  total: number;
  frequencyData: { name: string; count: number }[];
  frustrationData: { name: string; count: number }[];
  anxietyData: { name: string; count: number }[];
  timeData: { name: string; count: number }[];
}

export interface SupabaseSurveyRow {
  gym_frequency: string;
  experience_rating: string;
  frustrations: string[];
  gym_time: string;
  gym_anxiety: string;
  biggest_challenge: string;
  improvements: string[];
}
