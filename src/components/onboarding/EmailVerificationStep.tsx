
import React from "react";
import { motion } from "framer-motion";
import { Mail, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EmailVerificationStepProps {
  error?: string | null;
}

const EmailVerificationStep: React.FC<EmailVerificationStepProps> = ({ error }) => {
  const { language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-6 p-4"
    >
      <motion.div variants={itemVariants}>
        {error ? (
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
        ) : (
          <Mail className="mx-auto h-16 w-16 text-pink-500" />
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">
          {error 
            ? (language === "fr" ? "Erreur de vérification" : "Verification Error") 
            : (language === "fr" ? "Vérifiez votre email" : "Check your email")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {error
            ? error
            : (language === "fr"
                ? `Nous avons envoyé un lien de confirmation à votre adresse email. 
                   Veuillez cliquer sur ce lien pour activer votre compte.`
                : `We've sent a confirmation link to your email address. 
                   Please click on the link to activate your account.`)}
        </p>
      </motion.div>

      {error && (
        <motion.div variants={itemVariants}>
          <p className="mt-4 text-sm text-muted-foreground">
            {language === "fr"
              ? "Si vous continuez à rencontrer ce problème, veuillez nous contacter ou essayer de vous reconnecter."
              : "If you continue to experience this issue, please contact us or try logging in again."}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmailVerificationStep;
