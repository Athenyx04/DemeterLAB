import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, logout } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { query, collection, getDocs, where } from 'firebase/firestore';
import './Dashboard.css';

function Dashboard() {
  const [name, setName] = useState('');
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.name);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (loading) {
      // Trigger loading screen
      return;
    }
    if (!user) {
      navigate('/');
    } else {
      fetchUsername();
    }
  }, [user, loading, navigate]);

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as
        <div>{name}</div>
        <div>{user?.email}</div>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
