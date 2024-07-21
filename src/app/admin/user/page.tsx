'use client';

import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import Table from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { getErrorMessage } from '@/app/utils/get-error-message';
import { useUserDataContext } from '@/app/contexts/UserData';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const UsersPage = () => {
  const { userData } = useUserDataContext();
  const {data:session} = useSession();
  
  const router = useRouter();
  
  const [userIsAdmin, setUserIsAdmin] = useState(userData.role === 'ADMIN');
  const [isAuthenticated, setIsAuthenticated] = useState(session?.user.accessToken != null);

  useEffect(() => {
    setUserIsAdmin(userData.role === 'ADMIN');
    setIsAuthenticated(session?.user.accessToken != null);
  }, [userData, session]);
  

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
    currentPage: 1,
    prev: null,
    next: null,
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'status', title: 'Status' },
    { key: 'createdAt', title: 'Created At' },
    { key: 'updatedAt', title: 'Updated At' },
  ];

  const axiosAuth = useAxiosAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosAuth.get('/api/user', {
        params: {
          page: pagination.page,
          perPage: pagination.perPage,
          search,
        },
      });
      const { data, meta } = response.data;
      setUsers(data);
      setPagination({
        ...meta,
        page: meta.currentPage,
      });
    } catch (error) {
      setError(getErrorMessage(error, 'Failed to fetch users.'));
    } finally {
      setLoading(false);
    }
  };

  
  const handleInactiveUser = async (id: number) => {
    try {
      await axiosAuth.delete(`/api/user/${id}`);
      fetchUsers();
    } catch (error) {
      setError(getErrorMessage(error, 'Failed to inactive user.'));
    }
  }
  
  useEffect(() => {
    if(!userIsAdmin || !isAuthenticated) {
      router.push('/')
    }
    
    if(!loading) {
      fetchUsers();
    }
  }, [pagination.page, search, userIsAdmin, isAuthenticated]);

  console.log(pagination.page);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };


  const handleSearchChange = useCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    }, 500),
    []
  );

  const handleSort = (key: string) => {
    console.log('Sort by ' + key)
  };

  return (
    <div>
      {error && <div className="text-red-600">{error}</div>}
      <Table data={users} columns={columns} onSort={handleSort} 
      onNextPage={() => handlePageChange(pagination.currentPage + 1)} 
      onPreviousPage={() => handlePageChange(pagination.currentPage - 1)}
      disableNextPage={pagination.currentPage >= pagination.lastPage}
      disablePreviousPage={pagination.currentPage === 1}
      changeInputSearch={handleSearchChange}
      handleDeleteAction={handleInactiveUser}/>
    </div>
  );
};

export default UsersPage;
