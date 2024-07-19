import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { getErrorMessage } from '@/app/utils/get-error-message';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório')
    .trim()
    .lowercase(),
});

export type TForgotPasswordComponentProps = {
  onClose?: () => void;
};

const ForgotPasswordComponent = ({ onClose }: TForgotPasswordComponentProps) => {
  const [inRequest, setInRequest] = React.useState<boolean>(false);
  const [messageError, setMessageError] = React.useState<string | null>(null);
  const [messageSuccess, setMessageSuccess] = React.useState<string | null>(null);

  useEffect(() => {
    return () => {
      setMessageError(null);
      setMessageSuccess(null);
    };
  }, []);

  const axiosAuth = useAxiosAuth();

  async function sendResetPasswordEmail(data: { email: string }) {
    return await axiosAuth.post('/api/auth/forgot/password', data);
  }

  const cleanErrors = () => {
    setMessageError(null);
    setMessageSuccess(null);
  }

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        cleanErrors();
        setInRequest(true);
        await sendResetPasswordEmail(values);
        setMessageSuccess('Se um usuário com este email existir, um link de redefinição de senha será enviado.');
        if(onClose) onClose();
      } catch (error) {
        console.error('Erro ao solicitar redefinição de senha:', error);
        setMessageError(getErrorMessage(error, 'Erro ao solicitar redefinição de senha.'));
      } finally {
        setInRequest(false);
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Esqueci Minha Senha</CardTitle>
        {messageError && <CardDescription className="text-red-600">{messageError}</CardDescription>}
        {messageSuccess && <CardDescription className="text-green-600">{messageSuccess}</CardDescription>}
      </CardHeader>
      <CardContent className="flex gap-3 flex-col">
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <Input
              name="email"
              placeholder="E-mail"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.email && formik.errors.email ? 'error' : ''}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-projRed">{formik.errors.email}</div>
            )}
          </div>
          <Button type="submit" disabled={!formik.isValid || !formik.dirty || inRequest}>
            Enviar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordComponent;
