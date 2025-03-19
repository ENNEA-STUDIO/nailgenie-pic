
export interface SavedDesign {
  id: string;
  created_at: string;
  image_url: string;
  prompt: string | null;
  user_id: string;
  is_shared?: boolean;
}

export interface ActionFeedback {
  type: 'success' | 'error';
  message: string;
  visible: boolean;
}
