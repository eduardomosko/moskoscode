import useMeasure from 'react-use-measure'
import Footer from '../components/Footer'
import Header from '../components/Header'
import '../styles/globals.css'

const App = ({ Component, pageProps }) => (
  <div className='flex flex-col min-h-screen bg-white'>
    <Header />
    <div className='flex flex-grow justify-center'>
      <main className='mx-5 w-full sm:max-w-2xl 2xl:max-w-5xl'>
        <Component {...pageProps} />
      </main>
    </div>
    <Footer />
  </div>
)

export default App
