
export interface SavedDesign {
  id: string;
  created_at: string;
  image_url: string;
  prompt: string | null;
  user_id: string;
  is_shared?: boolean;
  nail_shape?: string;
  nail_color?: string;
  nail_length?: string;
}

export interface ActionFeedback {
  type: 'success' | 'error';
  message: string;
  visible: boolean;
}
