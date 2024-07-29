'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { getErrorMessage } from '@/app/utils/get-error-message';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .required('A nova senha é obrigatória')
    .max(255, 'A nova senha deve ter no máximo 255 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial'
    ),
  recoveryToken: Yup.string().required('O token de recuperação é obrigatório'),
});

function ChangePasswordContent() {
  const router = useRouter();
  const { status } = useSession();
  const query = useSearchParams();
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageSuccess, setMessageSuccess] = useState<string | null>(null);

  const axiosAuth = useAxiosAuth();

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      recoveryToken: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        cleanErrors();
        await changePassword(values);
        setMessageSuccess('Senha alterada com sucesso.');

        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Erro ao alterar senha:', error);
        setMessageError(getErrorMessage(error, 'Erro ao alterar senha.'));
      }
    },
  });

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [router, status]);

  useEffect(() => {
    if (query.get("recovery_token")) {
      formik.setFieldValue('recoveryToken', query.get("recovery_token"));
    } else {
      router.push('/');
    }
  }, [query, router]);

  const cleanErrors = () => {
    setMessageError(null);
    setMessageSuccess(null);
  };

  async function changePassword(data: { newPassword: string; recoveryToken: string }) {
    return await axiosAuth.patch('/api/auth/recovery/password', data);
  }

  return (
    <Card className='bg-slate-200 w-96 m-auto'>
      <CardHeader>
        <CardTitle>Escolha uma nova senha</CardTitle>
        {messageError && <CardDescription className="text-red-600">{messageError}</CardDescription>}
        {messageSuccess && <CardDescription className="text-green-600">{messageSuccess}</CardDescription>}
      </CardHeader>
      <CardContent className="flex gap-3 flex-col">
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <Input
              name="newPassword"
              placeholder="Nova Senha"
              type="password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.newPassword && formik.errors.newPassword ? 'error' : ''}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="text-red-600">{formik.errors.newPassword}</div>
            )}
          </div>
          <Button type="submit" disabled={!formik.isValid || !formik.dirty}>
            Alterar Senha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ChangePassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordContent />
    </Suspense>
  );
}
