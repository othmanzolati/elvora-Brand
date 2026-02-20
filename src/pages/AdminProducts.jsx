import { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { 
  FiTrash2, FiPlus, FiImage, FiVideo, 
  FiLayers, FiLoader, FiCheckCircle, FiEdit3, FiX 
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const AdminProducts = () => {
  const { addProduct, deleteProduct, products, loading, updateProduct } = useAdmin(); 
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", price: "", category: "Men", description: ""
  });

  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);

  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentProductId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setFormData({ name: "", price: "", category: "Men", description: "" });
    setMainImage(null);
    setGalleryImages([]);
    setVideoFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isEditing && !mainImage) {
      return toast.error("Image principale obligatoire !");
    }

    const loadingToast = toast.loading(isEditing ? "Modification en cours..." : "Publication en cours...");

    let result;
    if (isEditing) {
      result = await updateProduct(
        currentProductId,
        { ...formData, price: parseFloat(formData.price) },
        mainImage,
        galleryImages,
        videoFile
      );
    } else {
      result = await addProduct(
        { ...formData, price: parseFloat(formData.price) },
        mainImage,
        galleryImages,
        videoFile
      );
    }

    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success(isEditing ? "Produit modifié !" : "Produit publié !", {
        duration: 4000,
        icon: '🚀',
      });
      resetForm();
    } else {
      toast.error("Erreur: " + result.error);
    }
  };

  // --- DELETE MODIFIÉE (Directe - No Alert) ---
  const handleDelete = async (id) => {
    // Clika we7da katsift l-msi7 direct o kat-tla3 toast dyal l-progress
    const deletePromise = deleteProduct(id);
    
    toast.promise(deletePromise, {
      loading: 'Suppression en cours...',
      success: 'Produit supprimé avec succès !',
      error: 'Erreur lors de la suppression.',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* --- FORMULAIRE --- */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 sticky top-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                {isEditing ? <FiEdit3 className="text-orange-500" /> : <FiPlus className="text-blue-600" />} 
                {isEditing ? "Modifier" : "Ajouter"}
                </h2>
                {isEditing && (
                    <button onClick={resetForm} className="text-slate-400 hover:text-red-500 transition-colors">
                        <FiX size={20}/>
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nom du produit"
                className="w-full bg-slate-50 border p-3 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="Prix (MAD)"
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none focus:border-blue-500 text-sm font-bold"
                  required
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none text-sm cursor-pointer"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description du produit..."
                className="w-full bg-slate-50 border p-3 rounded-xl h-24 outline-none focus:border-blue-500 text-sm resize-none"
                required
              />

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {isEditing ? "Changer les médias (optionnel)" : "Contenu Média"}
                </p>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold flex items-center gap-2"><FiImage/> Image Principale</label>
                  <input 
                    type="file" accept="image/*"
                    onChange={(e) => setMainImage(e.target.files[0])}
                    className="text-xs w-full file:bg-slate-900 file:text-white file:rounded-lg file:px-3 file:py-1 file:border-0 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold flex items-center gap-2"><FiLayers/> Galerie (Max 2)</label>
                  <input 
                    type="file" multiple accept="image/*"
                    onChange={(e) => setGalleryImages(Array.from(e.target.files).slice(0, 2))}
                    className="text-xs w-full file:bg-blue-50 file:text-blue-600 file:rounded-lg file:px-3 file:py-1 file:border-0 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold flex items-center gap-2"><FiVideo/> Vidéo 360°</label>
                  <input 
                    type="file" accept="video/mp4"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="text-xs w-full file:bg-purple-50 file:text-purple-600 file:rounded-lg file:px-3 file:py-1 file:border-0 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? 'bg-slate-300' : isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg`}
              >
                {loading ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                {loading ? "Traitement..." : isEditing ? "Enregistrer" : "Publier"}
              </button>
            </form>
          </div>
        </div>

        {/* --- LISTE --- */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 text-lg">Catalogue</h3>
              <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500">{products.length} Articles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Produit</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 text-center">Prix</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 text-center">Media</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-12 h-14 rounded-lg object-cover bg-slate-100 border border-slate-100" />
                          <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{p.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-sm text-blue-600">{p.price} MAD</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          {p.gallery?.length > 0 && <FiLayers title="Gallery" className="text-blue-400" />}
                          {p.video_360 && <FiVideo title="360 Video" className="text-purple-400" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(p)}
                            className="p-2.5 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                          >
                            <FiEdit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;