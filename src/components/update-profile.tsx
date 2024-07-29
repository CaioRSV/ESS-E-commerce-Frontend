import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AuthMe, useUserDataContext } from '@/app/contexts/UserData';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { getErrorMessage } from '@/app/utils/get-error-message';

const validationSchema = Yup.object({
  name: Yup.string()
    .max(200, 'O campo de nome deve ter menos de 200 caracteres')
    .trim()
    .required('O campo de nome deve ser preenchido'),
  email: Yup.string()
    .email('O campo de email deve ser um e-mail válido')
    .max(200, 'O campo de email deve ter menos de 200 caracteres')
    .trim()
    .required('O campo de email deve ser preenchido')
    .lowercase()
    .required('O campo de email deve ser preenchido'),
});

export type TUpdateProfileComponentProps = {
  onClose: () => void;
}

const UpdateProfileComponent = ({ onClose }: TUpdateProfileComponentProps) => {
  const [inRequest, setInRequest] = React.useState<boolean>(false);
  const [messageErrorChangePersonalData, setMessageErrorChangePersonalData] = React.useState<string | null>(null);

  useEffect(() => {
    return () => {
      setMessageErrorChangePersonalData(null);
    }
  }, []);

  const axiosAuth = useAxiosAuth();

  async function updatePersonalData(data: {
    name: string;
    email: string;
  }) {
    return await axiosAuth.patch('/api/user/personal/data', data);
  }

  const { userData, setUserData } = useUserDataContext();

  const formik = useFormik({
    initialValues: {
      name: userData.name || '',
      email: userData.email || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setInRequest(true);
        await updatePersonalData(values);
        setUserData({ ...userData, name: values.name, email: values.email });
        onClose();
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        setMessageErrorChangePersonalData(getErrorMessage(error, 'Erro ao atualizar perfil'));
      } finally {
        setInRequest(false);
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atualizar Meus Dados</CardTitle>
        {messageErrorChangePersonalData != null && (
          <>
            <CardDescription>{messageErrorChangePersonalData}</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="flex gap-3 flex-col">
        <form onSubmit={formik.handleSubmit}>
          <div className='mb-4'>
            <Input
              name="name"
              placeholder="Nome"
              id="nameUpdatePersonalData"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.name && formik.errors.name ? '' : ''}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-projRed">{formik.errors.name}</div>
            )}
          </div>
          <div className='mb-4'>
            <Input
              name="email"
              placeholder="Email"
              id="emailUpdatePersonalData"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.email && formik.errors.name ? '' : ''}
            />
            {formik.touched.name && formik.errors.email && (
              <div className="text-projRed">{formik.errors.email}</div>
            )}
          </div>
          <Button type="submit" disabled={!formik.isValid || !formik.dirty || inRequest} id="sendUpdatePersonalDataButton"
          >Atualizar</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateProfileComponent;
