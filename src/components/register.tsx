'use client';

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { signIn } from 'next-auth/react';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { getErrorMessage } from '@/app/utils/get-error-message';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('O campo de email deve ser um e-mail válido')
    .max(200, 'O campo de email deve ter menos de 200 caracteres')
    .required('O campo de email deve ser preenchido')
    .trim()
    .lowercase(),
  name: Yup.string()
    .max(200, 'O campo de nome deve ter menos de 200 caracteres')
    .required('O campo de nome deve ser preenchido')
    .trim(),
  password: Yup.string()
    .min(3, 'O campo password deve ter mais de 3 caracteres')
    .max(255, 'O campo password deve ter menos de 255 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W|_)[\S]{8,}$/, {
      message: 'A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
    })
    .required('O campo de senha é obrigatório')
    .trim(),
});

const RegisterComponent = () => {
  const [messageErrorRegister, setMessageErrorRegister] = useState<string | null>(null);
  const [messageErrorEmail, setMessageErrorEmail] = useState<string | null>(null);
  const [inRequest, setInRequest] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setMessageErrorRegister(null);
    }
  }, []);

  const authAxios = useAxiosAuth();

  async function registerUser(data: { email: string; name: string; password: string }) {
    return await authAxios.post('/api/auth/register', data);
  }

  async function checkEmailAvailability(email: string) {
    try {
      const response = await authAxios.post('/api/auth/email/availability', { email });
      if (!response.data.available) {
        setMessageErrorEmail('O e-mail já está em uso.');
      } else {
        setMessageErrorEmail(null);
      }
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do e-mail:', error);
      setMessageErrorEmail(getErrorMessage(error, 'Erro ao verificar disponibilidade do e-mail.'));
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

  const handleRegister = async (values: { email: string; name: string; password: string }) => {
    try {
      setInRequest(true);
      await registerUser(values);
      await signIn('credentials', {
        redirect: true,
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      console.error(error);
      setMessageErrorRegister(getErrorMessage(error, "Erro ao registrar o usuário, valide os dados preenchidos"));
    } finally {
      setInRequest(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro</CardTitle>
      </CardHeader>
      <CardContent className={`flex gap-3 flex-col`}>
        {messageErrorRegister && <CardDescription>{messageErrorRegister}</CardDescription>}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <Input
              name="email"
              placeholder="E-mail"
              id="emailRegister"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                checkEmailAvailability(e.target.value);
              }}
              className={formik.touched.email && (formik.errors.email || messageErrorEmail) ? 'error' : ''}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-projRed">{formik.errors.email}</div>
            )}
            {messageErrorEmail && (
              <div className="text-projRed">{messageErrorEmail}</div>
            )}
          </div>

          <div className="mb-4">
            <Input
              name="name"
              placeholder="Nome"
              id="nameRegister"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.name && formik.errors.name ? 'error' : ''}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-projRed">{formik.errors.name}</div>
            )}
          </div>

          <div className="mb-4">
            <Input
              name="password"
              placeholder="Senha"
              type="password"
              id="passwordRegister"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.password && formik.errors.password ? 'error' : ''}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-projRed">{formik.errors.password}</div>
            )}
          </div>
          <Button type="submit" id="registerButton" disabled={inRequest || !formik.isValid || !formik.dirty || messageErrorEmail != null}>
            Registrar-se
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterComponent;
