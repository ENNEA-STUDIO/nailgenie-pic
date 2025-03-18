
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Votre nom" 
                  {...field} 
                  className="h-12"
                />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="votre@email.com" 
                  type="email" 
                  {...field} 
                  className="h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ProfileForm;
