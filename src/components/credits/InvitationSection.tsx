
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Share2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InvitationSection: React.FC = () => {
  const { t } = useLanguage();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Fetch existing invitation codes on component mount
  useEffect(() => {
    const fetchInviteCode = async () => {
      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('code')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setInviteCode(data[0].code);
        }
      } catch (error) {
        console.error('Error fetching invitation code:', error);
      }
    };
    
    fetchInviteCode();
  }, []);
  
  const generateInviteCode = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.rpc('create_invitation');
      
      if (error) throw error;
      
      setInviteCode(data);
      toast.success(t.credits.success);
    } catch (error) {
      console.error('Error generating invitation code:', error);
      toast.error('Error generating invitation code');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setIsCopied(true);
      toast.success(t.credits.inviteCodeCopied);
      
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };
  
  const shareInvite = () => {
    if (inviteCode) {
      const shareText = `Join me on NailGenie and get 5 free credits! Use my invitation code: ${inviteCode}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'NailGenie Invitation',
          text: shareText,
          url: window.location.origin,
        }).catch(err => {
          console.error('Error sharing:', err);
        });
      } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareText);
        toast.success(t.credits.inviteCodeCopied);
      }
    }
  };
  
  return (
    <Card className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">{t.credits.inviteFriends}</CardTitle>
        <CardDescription>{t.credits.inviteExplainer}</CardDescription>
      </CardHeader>
      <CardContent>
        {inviteCode ? (
          <>
            <div className="bg-white p-4 rounded-lg border border-primary/20 text-center mb-4">
              <span className="text-xl font-mono font-bold text-primary">{inviteCode}</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center gap-2"
                onClick={copyToClipboard}
              >
                {isCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {isCopied ? t.credits.success : t.credits.copyCode}
              </Button>
              <Button 
                variant="default"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={shareInvite}
              >
                <Share2 className="h-4 w-4" />
                {t.credits.shareInvite}
              </Button>
            </div>
          </>
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="default"
              className="w-full"
              onClick={generateInviteCode}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                  {t.credits.processing}
                </span>
              ) : (
                t.credits.generateInvite
              )}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationSection;
