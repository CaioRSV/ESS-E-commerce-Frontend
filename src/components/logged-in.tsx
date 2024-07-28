import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import OrderList from './orderList';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import UpdateProfileComponent from './update-profile';
import ChangePasswordComponent from './change-password';
import { AuthMe, useUserDataContext } from '@/app/contexts/UserData';
import OrderListAdmin from './orderListAdmin';
import { useRouter } from 'next/navigation';

export type TLoggedInCardComponentProps = {
  userData: AuthMe;
  handleSignOut: () => void;
};

const LoggedInCardComponent = ({ userData, handleSignOut }: TLoggedInCardComponentProps) => {
  const router = useRouter();
  const [isUpdateProfileOpen, setUpdateProfileOpen] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleUpdateProfileClose = () => setUpdateProfileOpen(false);
  const handleChangePasswordClose = () => setChangePasswordOpen(false);
  const redirectToUser = () => router.push('/admin/user');
  const redirectToProduct = () => router.push('/admin/product');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle id="loggedInMessage" >Bem-vindo, {userData?.name ? userData.name : 'Carregando...'}</CardTitle>
        <CardDescription id="loggedInEmail">{userData?.email ? userData.email : ''}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3 flex-col">
        <Dialog open={isUpdateProfileOpen} onOpenChange={setUpdateProfileOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setUpdateProfileOpen(true)} id="updatePersonalDataButton">Atualizar meus dados</Button>
          </DialogTrigger>
          <DialogContent id="loggedInCloseButton">
            <UpdateProfileComponent onClose={handleUpdateProfileClose} />
          </DialogContent>
        </Dialog>
        <Dialog open={isChangePasswordOpen} onOpenChange={setChangePasswordOpen}>
          <DialogTrigger asChild>
            <Button id="updatePersonalPasswordButton" onClick={() => setChangePasswordOpen(true)}>Mudar minha senha</Button>
          </DialogTrigger>
          <DialogContent>
            <ChangePasswordComponent onClose={handleChangePasswordClose} />
          </DialogContent>
        </Dialog>
        {
          userData.role=='ADMIN'
            && 
            <Button onClick={() => redirectToUser()}>Usuários</Button>
        }
        {
          userData.role=='ADMIN'
            && 
            <Button onClick={() => redirectToProduct()}>Produtos</Button>
        }
        {
          userData.role=='ADMIN'
            ?
            <OrderListAdmin />
            :
            <OrderList />
        }
        <Button onClick={handleSignOut} id="navbarLogoutButton">Deslogar</Button>
      </CardContent>
    </Card>
  );
};

export default LoggedInCardComponent;
