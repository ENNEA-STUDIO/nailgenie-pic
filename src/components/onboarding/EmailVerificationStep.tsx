import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const EmailVerificationStep = () => {
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
        <Mail className="mx-auto h-16 w-16 text-pink-500" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">
          {language === "fr" ? "Vérifiez votre email" : "Check your email"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {language === "fr"
            ? `Nous avons envoyé un lien de confirmation à votre adresse email. 
               Veuillez cliquer sur ce lien pour activer votre compte.`
            : `We've sent a confirmation link to your email address. 
               Please click on the link to activate your account.`}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EmailVerificationStep;
