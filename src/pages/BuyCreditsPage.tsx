import React, { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, CreditCard, Zap } from "lucide-react";
import { InfinityIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/navigation/BottomNav";
import NailPolishIcon from "@/components/credits/NailPolishIcon";
import InvitationSection from "@/components/credits/InvitationSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import LogoutButton from "@/components/auth/LogoutButton";
import MollieSubscriptionDialog from "@/components/credits/MollieSubscriptionDialog";
import { supabase } from "@/integrations/supabase/client";

type OfferType = "credits" | "premium" | "subscription";

const BuyCreditsPage: React.FC = () => {
  const {
    credits,
    hasUnlimitedSubscription,
    subscriptionStart,
    subscriptionEnd,
    checkCredits,
    checkSubscription,
  } = useApp();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<OfferType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const locale = language === "fr" ? fr : enUS;

    return format(date, "PPP", { locale });
  };

  const startDate = subscriptionStart ? formatDate(subscriptionStart) : null;
  const renewalDate = subscriptionEnd ? formatDate(subscriptionEnd) : null;

  const handlePaymentClick = (type: OfferType) => {
    setSelectedOffer(type);
    setShowDialog(true);
  };

  const handlePaymentSuccess = () => {
    setIsProcessing(false);
    setShowSuccess(true);

    // Update credits or subscription info
    if (selectedOffer === "credits") {
      checkCredits();
    } else {
      checkSubscription();
    }

    // Reset after a moment
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedOffer(null);
    }, 3000);
  };

  const handleBuy = async ({
    amount,
    description,
    offerType,
    creditsCount,
    interval,
  }: {
    amount: string;
    description: string;
    offerType: "credits" | "premium" | "subscription";
    creditsCount?: number;
    interval?: string;
  }) => {
    setIsProcessing(true);
    setSelectedOffer(offerType);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        throw new Error("User not authenticated");
      }

      const res = await fetch(
        "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/create-mollie-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session.access_token}`,
          },

          body: JSON.stringify({
            amount,
            description,
            offerType,
            creditsCount,
            interval,
            redirectUrl: window.location.origin + "/payment-success",
            webhookUrl:
              "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/mollie-webhook",
            name: session.session.user.email,
            email: session.session.user.email,
            user_id: session.session.user.id,
          }),
        }
      );
      const data = await res.json();
      if (data.checkoutUrl && data.paymentId) {
        sessionStorage.setItem("mollie_payment_id", data.paymentId);
        window.location.href = data.checkoutUrl;
      } else {
        setIsProcessing(false);
        alert(data.error || "Erreur paiement");
      }
    } catch (err) {
      setIsProcessing(false);
      alert("Erreur paiement");
    }
  };
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 p-4 pb-32"
    >
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-medium ml-2">{t.credits.buyCredits}</h1>
      </div>

      <div className="flex-1 space-y-6">
        {/* Credit Pack Card */}
        {!hasUnlimitedSubscription && (
          <Card className="border-2 overflow-hidden">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit mb-2">
                {t.credits.oneTimePurchase}
              </Badge>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                {t.credits.creditPack}
              </CardTitle>
              <CardDescription>
                10 designs = 10 {language === "fr" ? "crédits" : "credits"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-2">
              <div className="flex items-center mb-3">
                <span className="text-3xl font-bold text-primary">2,99 €</span>
              </div>

              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-green-500" />
                  {t.credits.tenCreditsForDesigns}
                </li>
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full py-6 relative"
                size="lg"
                onClick={() =>
                  handleBuy({
                    amount: "2.99",
                    description: "Achat de crédits",
                    offerType: "credits",
                    creditsCount: 10,
                  })
                }
                disabled={isProcessing}
              >
                {isProcessing && selectedOffer === "credits" ? (
                  <span className="flex items-center">
                    <NailPolishIcon className="animate-bounce mr-2" />
                    {t.credits.processing}
                  </span>
                ) : showSuccess && selectedOffer === "credits" ? (
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    {t.credits.success}
                  </span>
                ) : (
                  "2,99 €"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Subscription Card */}
        <Card
          className={`border-2 ${
            hasUnlimitedSubscription ? "border-green-500" : "border-primary/50"
          } overflow-hidden relative`}
        >
          <div className="absolute top-0 right-0">
            <Badge className="m-2 bg-primary">
              {hasUnlimitedSubscription
                ? t.credits.active
                : t.credits.mostPopular}
            </Badge>
          </div>

          <CardHeader className="pb-2">
            <Badge
              variant={hasUnlimitedSubscription ? "success" : "outline"}
              className="w-fit mb-2"
            >
              {t.credits.subscriptionExplainer}
            </Badge>
            <CardTitle className="flex items-center gap-2">
              <InfinityIcon className="h-5 w-5 text-primary" />
              {t.credits.unlimitedPlan}
            </CardTitle>
            <CardDescription>{t.credits.unlimitedExplainer}</CardDescription>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="flex items-center mb-3">
              <span className="text-3xl font-bold text-primary">8,99 €</span>
              <span className="text-sm text-muted-foreground ml-2">/mois</span>
            </div>

            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-green-500" />
                {t.credits.unlimitedDesigns}
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-green-500" />
                {t.credits.cancelAnytime}
              </li>
            </ul>

            {hasUnlimitedSubscription && renewalDate && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md text-sm">
                <p>
                  {language === "fr" ? "Renouvellement le" : "Renews on"}:{" "}
                  <strong>{renewalDate}</strong>
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter>
            {hasUnlimitedSubscription ? (
              <Button
                className="w-full py-6 relative overflow-hidden group"
                size="lg"
                variant="outline"
                disabled
              >
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                <span>{t.credits.alreadySubscribed}</span>
              </Button>
            ) : (
              <Button
                className="w-full py-6 relative"
                size="lg"
                onClick={() =>
                  handleBuy({
                    amount: "8.99",
                    description: "Abonnement illimité",
                    offerType: "subscription",
                    interval: "1 month",
                  })
                }
                disabled={isProcessing}
              >
                {isProcessing && selectedOffer === "subscription" ? (
                  <span className="flex items-center">
                    <NailPolishIcon className="animate-bounce mr-2" />
                    {t.credits.processing}
                  </span>
                ) : showSuccess && selectedOffer === "subscription" ? (
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    {t.credits.success}
                  </span>
                ) : (
                  "8,99 €/mois"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        <InvitationSection />
      </div>

      {/* Payment Dialog */}
      <MollieSubscriptionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        isSubscription={selectedOffer === "subscription"}
        onSuccess={handlePaymentSuccess}
      />

      <div className="flex justify-center mb-20">
        <LogoutButton
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground opacity-50 hover:opacity-100 transition-all"
        />
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default BuyCreditsPage;
