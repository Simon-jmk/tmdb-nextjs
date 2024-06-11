import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/layout';
import "../styles/global.css"

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;