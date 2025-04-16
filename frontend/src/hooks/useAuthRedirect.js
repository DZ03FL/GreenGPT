import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/status', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok || !data.authenticated) {
            navigate('/login');
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);
};

export default useAuthRedirect;
