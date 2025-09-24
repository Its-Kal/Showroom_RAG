export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  image: string;
  rating: number; // 1-5
  message: string;
}