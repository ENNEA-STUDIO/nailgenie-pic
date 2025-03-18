
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck, Check, X } from 'lucide-react';

const passwordSchema = z.object({
  password: z.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
    .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordFormProps {
  onSubmitValues: (values: PasswordFormValues) => void;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ onSubmitValues }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const password = form.watch('password');
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  const isComplete = form.formState.isValid;

  React.useEffect(() => {
    if (isComplete) {
      onSubmitValues(form.getValues());
    }
  }, [isComplete, form, onSubmitValues]);

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form 
          onChange={() => isComplete && onSubmitValues(form.getValues())}
          className="space-y-6"
        >
          <div className="mb-6">
            <motion.div 
              className="p-4 rounded-xl bg-secondary/50 border border-border mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={18} className="text-primary" />
                <span className="text-sm font-medium">Critères de sécurité</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  {hasMinLength ? 
                    <Check size={16} className="text-green-500" /> : 
                    <X size={16} className="text-muted-foreground" />
                  }
                  <span className={hasMinLength ? "text-foreground" : "text-muted-foreground"}>
                    8 caractères minimum
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {hasUppercase ? 
                    <Check size={16} className="text-green-500" /> : 
                    <X size={16} className="text-muted-foreground" />
                  }
                  <span className={hasUppercase ? "text-foreground" : "text-muted-foreground"}>
                    Au moins une majuscule
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {hasNumber ? 
                    <Check size={16} className="text-green-500" /> : 
                    <X size={16} className="text-muted-foreground" />
                  }
                  <span className={hasNumber ? "text-foreground" : "text-muted-foreground"}>
                    Au moins un chiffre
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Lock size={16} className="text-primary" />
                  <span>Mot de passe</span>
                </FormLabel>
                <FormControl>
                  <motion.div
                    whileTap={{ scale: 0.99 }}
                    className="relative"
                  >
                    <Input 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                      {...field} 
                      className="h-12 pl-10 pr-10 rounded-xl border-muted bg-background/70 backdrop-blur-sm focus:border-primary"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock size={18} />
                    </div>
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Lock size={16} className="text-primary" />
                  <span>Confirmer le mot de passe</span>
                </FormLabel>
                <FormControl>
                  <motion.div
                    whileTap={{ scale: 0.99 }}
                    className="relative"
                  >
                    <Input 
                      placeholder="••••••••" 
                      type={showConfirmPassword ? "text" : "password"}
                      {...field} 
                      className="h-12 pl-10 pr-10 rounded-xl border-muted bg-background/70 backdrop-blur-sm focus:border-primary"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock size={18} />
                    </div>
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={toggleShowConfirmPassword}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </motion.div>
  );
};

export default PasswordForm;
