import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { updatePersonalPassword } from '@/lib/api';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { signOut } from 'next-auth/react';

const validationSchema = Yup.object({
  actualPassword: Yup.string()
    .required('A senha atual é obrigatória')
    .trim(),
  newPassword: Yup.string()
    .required('A nova senha é obrigatória')
    .max(255, 'O campo password deve ter menos de 255 caracteres')
    .min(8, 'O campo password deve ter mais de 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W|_)[\S]{8,}$/, {
      message: 'A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
    })
    .trim(),
});

export type TChangePasswordComponentProps = {
  onClose: () => void;
}

const ChangePasswordComponent = ({ onClose }: TChangePasswordComponentProps) => {
  const [inRequest, setInRequest] = React.useState<boolean>(false);
  const [messageErrorChangePassword, setMessageErrorChangePassword] = React.useState<string | null>(null);

  useEffect(() => {
    return () => {
      setMessageErrorChangePassword(null);
    }
  }, []);

  const axiosAuth = useAxiosAuth();

  async function updatePersonalPassword(data: {
    actualPassword: string;
    newPassword: string;
  }) {
    return await axiosAuth.patch('/api/user/personal/password', data);
  }


  const formik = useFormik({
    initialValues: {
      actualPassword: '',
      newPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setInRequest(true)
        await updatePersonalPassword(values);
        onClose();
      } catch(error) {
        console.error('Erro ao mudar senha:', error);
        setMessageErrorChangePassword('Erro ao mudar senha');
      } finally {
        setInRequest(false);
      }
 
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mudar Minha Senha</CardTitle>
        {messageErrorChangePassword != null && (
          <>
            <CardDescription>{messageErrorChangePassword}</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="flex gap-3 flex-col">
        <form onSubmit={formik.handleSubmit}>
          <div className='mb-4'>
            <Input
              name="actualPassword"
              placeholder="Senha Atual"
              type="password"
              value={formik.values.actualPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.actualPassword && formik.errors.actualPassword ? 'error' : ''}
            />
            {formik.touched.actualPassword && formik.errors.actualPassword && (
              <div className="error-message">{formik.errors.actualPassword}</div>
            )}
          </div>
          <div className='mb-4'>
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
              <div className="error-message">{formik.errors.newPassword}</div>
            )}
          </div>
          <Button type="submit"  disabled={!formik.isValid || !formik.dirty || inRequest}>Mudar Senha</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordComponent;
