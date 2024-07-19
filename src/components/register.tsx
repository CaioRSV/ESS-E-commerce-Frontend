import { registerUser } from "@/lib/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { signIn } from "next-auth/react";

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

type TRegisterComponentProps = {}

const RegisterComponent = ({}: TRegisterComponentProps) => {
  const [messageErrorRegister, setMessageErrorRegister] = useState<string>();
  const [inRequest, setInRequest] = useState<boolean>(false);
  
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

  const handleRegister = async (values: {
    email: string;
    name: string;
    password: string;
  }) => {
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
      setMessageErrorRegister("Erro ao registrar o usuário, valide os dados preenchidos");
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
        {messageErrorRegister != null && (
          <>
            <CardDescription>{messageErrorRegister}</CardDescription>
          </>
        )}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <Input
              name="email"
              placeholder="E-mail"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.email && formik.errors.email ? '' : ''}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-projRed">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <Input
              name="name"
              placeholder="Nome"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.name && formik.errors.name ? '' : ''}
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
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.password && formik.errors.password ? '' : ''}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-projRed">{formik.errors.password}</div>
            )}
          </div>
          <Button type="submit" disabled={inRequest || !formik.isValid || !formik.dirty}>Registrar-se</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterComponent;
