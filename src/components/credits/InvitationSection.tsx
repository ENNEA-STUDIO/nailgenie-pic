import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Share2, CheckCircle, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InvitationSection: React.FC = () => {
  const { t } = useLanguage();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  useEffect(() => {
    fetchInviteCode();
  }, []);
  
  const fetchInviteCode = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (!sessionData.session) {
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      const { data, error } = await supabase
        .from('invitations')
        .select('code')
        .eq('user_id', userId)
        .is('used_by', null)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setInviteCode(data[0].code);
        console.log("Loaded existing invitation code:", data[0].code);
      }
    } catch (error) {
      console.error('Error fetching invitation code:', error);
    }
  };
  
  const generateInviteCode = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.rpc('create_invitation');
      
      if (error) throw error;
      
      console.log("Generated new invitation code:", data);
      setInviteCode(data);
      toast.success(t.credits.success);
    } catch (error) {
      console.error('Error generating invitation code:', error);
      toast.error('Error generating invitation link');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    if (inviteCode) {
      const inviteUrl = `${window.location.origin}/onboarding?invite=${inviteCode}`;
      navigator.clipboard.writeText(inviteUrl);
      setIsCopied(true);
      toast.success(t.credits.inviteCodeCopied);
      
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };
  
  const shareInvite = () => {
    if (inviteCode) {
      const inviteUrl = `${window.location.origin}/onboarding?invite=${inviteCode}`;
      const shareText = `${t.credits.shareText} ${inviteUrl}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'GeNails Invitation',
          text: shareText,
          url: inviteUrl,
        }).catch(err => {
          console.error('Error sharing:', err);
        });
      } else {
        navigator.clipboard.writeText(shareText);
        toast.success(t.credits.inviteCodeCopied);
      }
    }
  };
  
  return (
    <Card className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          {t.credits.inviteFriends}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded-xl border border-primary/10 shadow-inner overflow-hidden mb-4">
          <div className="bg-primary/5 p-4 text-center">
            <div className="flex justify-center items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-primary">{t.credits.rewardAmount}</span>
            </div>
            <p className="text-primary/80 font-medium text-sm">{t.credits.forYouAndFriend}</p>
          </div>
          
          <div className="p-4 text-center">
            <h3 className="font-medium text-primary mb-2">{t.credits.shareAndEarn}</h3>
            <p className="text-sm text-muted-foreground mb-3">{t.credits.inviteExplainer}</p>
            
            {inviteCode ? (
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareInvite}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium"
                >
                  <Share2 className="h-5 w-5" />
                  {t.credits.shareInvite}
                </motion.button>
                
                <div className="text-xs text-center text-muted-foreground">
                  {t.credits.inviteLinkReady}
                </div>
                
                <button 
                  className="text-xs text-primary flex items-center justify-center gap-1 w-full"
                  onClick={copyToClipboard}
                >
                  {isCopied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {isCopied ? t.credits.success : t.credits.copyCode}
                </button>
                
                <div className="mt-2 p-2 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500 mb-1">Code d'invitation:</div>
                  <div className="font-mono text-sm font-medium">{inviteCode}</div>
                </div>
              </div>
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
                    <span className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      {t.credits.generateInvite}
                    </span>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvitationSection;
