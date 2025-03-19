
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

  // Supprimé l'autosubmit de useEffect pour éviter le double avancement
  
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
          onSubmit={(e) => {
            e.preventDefault();
            if (isComplete) {
              onSubmitValues(form.getValues());
            }
          }}
          className="space-y-6"
        >
          <div className="mb-6">
            <motion.div 
              className="p-4 rounded-xl border mb-5 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(249,240,255,0.8) 100%)',
                borderColor: 'rgba(219, 39, 119, 0.1)',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.5)'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={18} className="text-pink-500" />
                <span className="text-sm font-medium">Critères de sécurité</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  {hasMinLength ? 
                    <Check size={16} className="text-pink-500" /> : 
                    <X size={16} className="text-muted-foreground" />
                  }
                  <span className={hasMinLength ? "text-foreground" : "text-muted-foreground"}>
                    8 caractères minimum
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {hasUppercase ? 
                    <Check size={16} className="text-pink-500" /> : 
                    <X size={16} className="text-muted-foreground" />
                  }
                  <span className={hasUppercase ? "text-foreground" : "text-muted-foreground"}>
                    Au moins une majuscule
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {hasNumber ? 
                    <Check size={16} className="text-pink-500" /> : 
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
                <FormLabel className="flex items-center gap-2 text-gray-700">
                  <Lock size={16} className="text-pink-500" />
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
                      className="h-12 pl-10 pr-10 rounded-xl border-pink-100 bg-white/90 backdrop-blur-sm focus:border-pink-300 focus:ring-pink-200"
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                      }}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400">
                      <Lock size={18} />
                    </div>
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </motion.div>
                </FormControl>
                <FormMessage className="text-pink-500" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-gray-700">
                  <Lock size={16} className="text-pink-500" />
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
                      className="h-12 pl-10 pr-10 rounded-xl border-pink-100 bg-white/90 backdrop-blur-sm focus:border-pink-300 focus:ring-pink-200"
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                      }}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400">
                      <Lock size={18} />
                    </div>
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                      onClick={toggleShowConfirmPassword}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </motion.div>
                </FormControl>
                <FormMessage className="text-pink-500" />
              </FormItem>
            )}
          />

          <motion.div
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }}
            className="mx-auto w-full"
          >
            <button 
              type="submit"
              className="w-full rounded-full px-8 py-3 gap-2 h-12 text-white"
              style={{
                background: 'linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)',
                boxShadow: '0 10px 15px -3px rgba(214, 31, 255, 0.2), 0 4px 6px -2px rgba(215, 115, 247, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
              }}
              disabled={!isComplete}
            >
              <span className="font-medium">Continuer</span>
            </button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

export default PasswordForm;
