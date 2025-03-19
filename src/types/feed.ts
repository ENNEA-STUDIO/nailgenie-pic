
import { SavedDesign } from './gallery';

export interface SharedDesign {
  id: string;
  created_at: string;
  image_url: string;
  prompt: string | null;
  user_id: string;
  nail_shape?: string;
  nail_color?: string;
  nail_length?: string;
}
