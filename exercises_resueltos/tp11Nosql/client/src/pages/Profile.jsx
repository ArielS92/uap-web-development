import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) return;
            try {
                const response = await fetch('/api/favorites', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFavorites(data);
                }
            } catch (error) {
                console.error('Failed to fetch favorites:', error);
            }
        };

        fetchFavorites();
    }, [user]);

    if (!user) {
        return <div className="profile-container">Please login to view profile.</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Welcome, {user.name}</h1>
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>

            <div className="favorites-section">
                <h2>My Favorites</h2>
                {favorites.length === 0 ? (
                    <p>No favorites yet.</p>
                ) : (
                    <div className="favorites-grid">
                        {favorites.map((fav) => (
                            <div key={fav._id} className="favorite-card">
                                <Link to={`/book/${fav.bookId}`}>
                                    <img src={fav.cover || 'https://via.placeholder.com/128x192'} alt={fav.title} />
                                    <h3>{fav.title}</h3>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        .profile-container {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
        }
        .logout-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1.5rem;
        }
        .favorite-card {
          text-align: center;
        }
        .favorite-card img {
          width: 100%;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .favorite-card h3 {
          font-size: 1rem;
          margin-top: 0.5rem;
          color: #333;
        }
      `}</style>
        </div>
    );
};

export default Profile;
