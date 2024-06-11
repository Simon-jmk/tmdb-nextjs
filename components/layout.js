import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const { isLoggedIn, logout } = useAuth();
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${query}`);
    }
  };

  return (
    <div>
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <div className="text-white">Home</div>
          </Link>
          <Link href="/favorites">
            <div className="text-white">Favorites</div>
          </Link>
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="border p-2 rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Sök
            </button>
          </form>
        </div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Log Out
            </button>
          ) : (
            <Link href="/login">
              <div className="bg-blue-500 text-white px-4 py-2 rounded">Log In</div>
            </Link>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
