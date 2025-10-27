import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Ekstrak `pathname` (misalnya, "/about" atau "/koleksi/1") dari lokasi URL saat ini.
  const { pathname } = useLocation();

  // `useEffect` ini akan berjalan setiap kali nilai `pathname` berubah.
  useEffect(() => {
    // Perintahkan browser untuk melakukan scroll ke paling atas halaman.
    window.scrollTo(0, 0);
  }, [pathname]);

  // Komponen ini tidak perlu menampilkan elemen visual apa pun, jadi kita kembalikan null.
  return null;
};

export default ScrollToTop;
