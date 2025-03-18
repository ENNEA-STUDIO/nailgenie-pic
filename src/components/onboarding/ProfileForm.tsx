
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { User, Mail } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  onSubmitValues: (values: ProfileFormValues) => void;
  defaultValues?: Partial<ProfileFormValues>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  onSubmitValues, 
  defaultValues = { fullName: '', email: '' } 
}) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: 'onChange',
  });

  const isComplete = form.formState.isValid;

  React.useEffect(() => {
    if (isComplete) {
      onSubmitValues(form.getValues());
    }
  }, [isComplete, form, onSubmitValues]);

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
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  <span>Nom complet</span>
                </FormLabel>
                <FormControl>
                  <motion.div
                    whileTap={{ scale: 0.99 }}
                    className="relative"
                  >
                    <Input 
                      placeholder="Votre nom" 
                      {...field} 
                      className="h-12 pl-10 rounded-xl border-muted bg-background/70 backdrop-blur-sm focus:border-primary"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User size={18} />
                    </div>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  <span>Email</span>
                </FormLabel>
                <FormControl>
                  <motion.div
                    whileTap={{ scale: 0.99 }}
                    className="relative"
                  >
                    <Input 
                      placeholder="votre@email.com" 
                      type="email" 
                      {...field} 
                      className="h-12 pl-10 rounded-xl border-muted bg-background/70 backdrop-blur-sm focus:border-primary"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail size={18} />
                    </div>
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

export default ProfileForm;
