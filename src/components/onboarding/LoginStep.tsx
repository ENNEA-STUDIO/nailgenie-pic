import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { motion } from 'framer-motion';
import { Mail, Key, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LoginStepProps {
  onSubmitValues: (values: { email: string; password: string }) => void;
  toggleLoginMode: () => void;
}

const loginSchema = z.object({
  email: z.string().email({
    message: "Email invalide",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères",
  }),
});

const LoginStep: React.FC<LoginStepProps> = ({ onSubmitValues, toggleLoginMode }) => {
  const { language } = useLanguage();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    onSubmitValues({
      email: values.email,
      password: values.password
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-center">
          {language === 'fr' ? 'Connexion' : 'Login'}
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          {language === 'fr' ? 'Entrez vos identifiants' : 'Enter your credentials'}
        </p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === 'fr' ? 'Email' : 'Email'}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input placeholder="your.email@example.com" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === 'fr' ? 'Mot de passe' : 'Password'}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input type="password" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2 space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90"
            >
              {language === 'fr' ? 'Se connecter' : 'Login'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              {language === 'fr' ? "Vous n'avez pas de compte ?" : "Don't have an account?"}
              <Button variant="link" type="button" onClick={toggleLoginMode} className="pl-1">
                {language === 'fr' ? "S'inscrire" : "Sign up"}
              </Button>
            </p>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

export default LoginStep;
