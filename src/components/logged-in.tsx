import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import OrderList from './orderList';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import UpdateProfileComponent from './update-profile';
import ChangePasswordComponent from './change-password';
import { AuthMe, useUserDataContext } from '@/app/contexts/UserData';
import OrderListAdmin from './orderListAdmin';

export type TLoggedInCardComponentProps = {
  userData: AuthMe;
  handleSignOut: () => void;
};

const LoggedInCardComponent = ({ userData, handleSignOut }: TLoggedInCardComponentProps) => {
  const [isUpdateProfileOpen, setUpdateProfileOpen] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleUpdateProfileClose = () => setUpdateProfileOpen(false);
  const handleChangePasswordClose = () => setChangePasswordOpen(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle id="loggedInMessage" >Bem-vindo, {userData?.name ? userData.name : 'Carregando...'}</CardTitle>
        <CardDescription>{userData?.email ? userData.email : ''}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3 flex-col">
        <Dialog open={isUpdateProfileOpen} onOpenChange={setUpdateProfileOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setUpdateProfileOpen(true)}>Atualizar meus dados</Button>
          </DialogTrigger>
          <DialogContent>
            <UpdateProfileComponent onClose={handleUpdateProfileClose} />
          </DialogContent>
        </Dialog>
        <Dialog open={isChangePasswordOpen} onOpenChange={setChangePasswordOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setChangePasswordOpen(true)}>Mudar minha senha</Button>
          </DialogTrigger>
          <DialogContent>
            <ChangePasswordComponent onClose={handleChangePasswordClose} />
          </DialogContent>
        </Dialog>
        {
          userData.role=='ADMIN'
            ?
            <OrderListAdmin />
            :
            <OrderList />
        }
        <Button onClick={handleSignOut}>Deslogar</Button>
      </CardContent>
    </Card>
  );
};

export default LoggedInCardComponent;
