import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import OrderList from './orderList';
import { AuthMe } from '@/app/contexts/UserData';

export type TLoggedInCardComponentProps = {
  userData: AuthMe;
  handleSignOut: () => void;
};

const LoggedInCardComponent = ({ userData, handleSignOut }: TLoggedInCardComponentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bem-vindo, {userData?.name ? userData.name : 'Carregando...'}</CardTitle>
        <CardDescription>{userData?.email ? userData.email : ''}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3 flex-col">
        <Button onClick={() => {}}>Atualizar meus dados</Button>
        <Button onClick={() => {}}>Mudar minha senha</Button>
        <OrderList />
        <Button onClick={handleSignOut}>Deslogar</Button>
      </CardContent>
    </Card>
  );
};

export default LoggedInCardComponent;
