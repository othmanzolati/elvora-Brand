import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  // --- A. Fetch Data Functions ---
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false });
      if (!error) setOrders(data || []);
    } catch (err) {
      console.error("Error Orders:", err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
      if (!error) setProducts(data || []);
    } catch (err) {
      console.error("Error Products:", err.message);
    }
  };

  // --- B. Realtime Subscription (The "No-Refresh" Solution) ---
  useEffect(() => {
    // Initial fetch
    fetchProducts();
    fetchOrders();

    // Listen to changes in Products table
    const productChannel = supabase
      .channel('realtime-products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setProducts((prev) => prev.map((p) => (p.id === payload.new.id ? payload.new : p)));
          }
        }
      )
      .subscribe();

    // Listen to changes in Orders table
    const orderChannel = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? payload.new : o)));
          }
        }
      )
      .subscribe();

    // Auth state listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      supabase.removeChannel(productChannel);
      supabase.removeChannel(orderChannel);
      subscription.unsubscribe();
    };
  }, []);

  // --- C. Add Product ---
  const addProduct = async (productData, mainImage, galleryImages, videoFile) => {
    setLoading(true);
    try {
      let mainImageUrl = "";
      if (mainImage) {
        const fileName = `main_${Date.now()}_${mainImage.name}`;
        await supabase.storage.from('product-media').upload(fileName, mainImage);
        mainImageUrl = supabase.storage.from('product-media').getPublicUrl(fileName).data.publicUrl;
      }

      let galleryUrls = [];
      if (galleryImages && galleryImages.length > 0) {
        for (const img of galleryImages) {
          const fileName = `gallery_${Date.now()}_${img.name}`;
          await supabase.storage.from('product-media').upload(fileName, img);
          galleryUrls.push(supabase.storage.from('product-media').getPublicUrl(fileName).data.publicUrl);
        }
      }

      let videoUrl = "";
      if (videoFile) {
        const fileName = `video_${Date.now()}_${videoFile.name}`;
        await supabase.storage.from('product-media').upload(fileName, videoFile);
        videoUrl = supabase.storage.from('product-media').getPublicUrl(fileName).data.publicUrl;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ 
          ...productData, 
          image: mainImageUrl, 
          gallery: galleryUrls, 
          video_360: videoUrl 
        }])
        .select();

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // --- D. Update Product ---
  const updateProduct = async (id, updatedData, newMainImage, newGallery, newVideo) => {
    setLoading(true);
    try {
      const originalProduct = products.find(p => p.id === id);
      let finalImageUrl = originalProduct.image;
      let finalGallery = originalProduct.gallery || [];
      let finalVideo = originalProduct.video_360;

      if (newMainImage) {
        const fileName = `main_${Date.now()}_${newMainImage.name}`;
        await supabase.storage.from('product-media').upload(fileName, newMainImage);
        finalImageUrl = supabase.storage.from('product-media').getPublicUrl(fileName).data.publicUrl;
      }

      if (newGallery && newGallery.length > 0) {
        let newGalleryUrls = [];
        for (const img of newGallery) {
          const fileName = `gallery_${Date.now()}_${img.name}`;
          await supabase.storage.from('product-media').upload(fileName, img);
          newGalleryUrls.push(supabase.storage.from('product-media').getPublicUrl(fileName).data.publicUrl);
        }
        finalGallery = newGalleryUrls;
      }

      if (newVideo) {
        const fileName = `video_${Date.now()}_${newVideo.name}`;
        await supabase.storage.from('product-media').upload(fileName, newVideo);
        finalVideo = supabase.storage.from('product-media').getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase
        .from('products')
        .update({
          ...updatedData,
          image: finalImageUrl,
          gallery: finalGallery,
          video_360: finalVideo
        })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // --- E. Update Order Status ---
  const updateOrderStatus = async (id, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (error) console.error(error.message);
  };

  // --- F. Delete Product (Pro SweetAlert) ---
  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This product will be permanently removed from your store.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-[20px]',
        confirmButton: 'rounded-full px-6 py-2 text-xs uppercase font-black',
        cancelButton: 'rounded-full px-6 py-2 text-xs uppercase font-black'
      }
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        Swal.fire({
          title: 'Deleted!',
          text: 'The product has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire('Error!', err.message, 'error');
      }
    }
  };

  // --- G. Delete Order (Pro SweetAlert) ---
  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Order Record?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete Forever',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-[20px]',
        confirmButton: 'rounded-full px-6 py-2 text-xs uppercase font-black',
        cancelButton: 'rounded-full px-6 py-2 text-xs uppercase font-black'
      }
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (error) throw error;
        Swal.fire({
          title: 'Removed!',
          text: 'Order record has been cleaned.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire('Failed!', err.message, 'error');
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    orders,
    products,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteOrder,
    updateOrderStatus,
    refreshData: () => { fetchOrders(); fetchProducts(); }
  };

  return (
    <AdminContext.Provider value={value}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">System Loading...</p>
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);