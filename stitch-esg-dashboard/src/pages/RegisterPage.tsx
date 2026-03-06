import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { LeafyGreen, Mail, Lock, User, Building } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  companyName: z.string().min(2, 'Nome da empresa muito curto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Create company doc first (simplified)
      const companyId = `comp_${Date.now()}`;
      await setDoc(doc(db, 'companies', companyId), {
        name: data.companyName,
        industry: 'Not specified',
        region: 'Not specified',
        currentXP: 0,
        level: 1,
        esgScores: { environmental: 0, social: 0, governance: 0 }
      });

      // Create user doc
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: data.name,
        email: data.email,
        companyId: companyId,
        role: 'admin',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`
      });

      navigate('/');
    } catch (err: any) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 my-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-slate-900 mb-4 shadow-lg shadow-primary/20">
            <LeafyGreen size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">GUIA ESG</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Crie sua conta de impacto</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-tight">Seu Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                {...register('name')}
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm"
                placeholder="João Silva"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-tight">Nome da Empresa</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                {...register('companyName')}
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm"
                placeholder="Impacto Tech S.A."
              />
            </div>
            {errors.companyName && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.companyName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-tight">Email Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                {...register('email')}
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm"
                placeholder="joao@empresa.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-tight">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  {...register('password')}
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm"
                  placeholder="••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-tight">Confirmar</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm"
                  placeholder="••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full py-4 text-base mt-4" isLoading={isLoading}>
            Criar Minha Jornada
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Faça login aqui
          </Link>
        </p>
      </div>
    </div>
  );
};
