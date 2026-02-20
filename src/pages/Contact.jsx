import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "24347d01-82a2-425d-94d7-5abb70c2a425",
          name: formData.name,
          email: formData.email,
          subject: `ELVORA Order/Inquiry: ${formData.subject}`,
          message: formData.message,
          from_name: "ELVORA Customer Support",
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Message sent successfully! Elvora will get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      alert("Network error. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 lg:py-20 font-sans">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">
            Contact Us
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* INFO SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-black mb-8 uppercase tracking-tighter text-slate-900 italic underline underline-offset-8 decoration-slate-200">
              ELVORA Studio
            </h2>

            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-5 group">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Email
                  </h3>
                  <p className="text-slate-900 font-bold text-sm">
                    elvorabrand@hotmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                  <Phone className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    WhatsApp
                  </h3>
                  <p className="text-slate-900 font-bold text-sm">
                    +212 6 06 09 15 15
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                  <MapPin className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Location
                  </h3>
                  <p className="text-slate-900 font-bold text-sm leading-relaxed">
                    AL Massira
                    <br /> Fez, Morocco
                  </p>
                </div>
              </div>
            </div>

            {/* IMAGE UPDATED SIZE: h-48 changed to h-[400px] or aspect-square */}
          <div className="rounded-2xl overflow-hidden grayscale border border-slate-100 shadow-lg hover:grayscale-0 transition-all duration-1000">
            <img
              // 7iyedna './public/' o zdna BASE_URL bach t-ban f GitHub Pages
              src={`${import.meta.env.BASE_URL}elevora.jpg`}
              alt="ELVORA Craft"
              className="w-full h-[450px] object-cover"/>
        </div>
          </motion.div>

          {/* FORM SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}>
            <form
              onSubmit={handleSubmit}
              className="bg-slate-50 p-8 lg:p-10 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black mb-8 uppercase tracking-tighter text-slate-900">
                Send a Message
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-slate-900 transition-all text-sm font-bold text-slate-900"
                    placeholder="Your Name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-slate-900 transition-all text-sm font-bold text-slate-900"
                      placeholder="Email Address"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-slate-900 transition-all text-sm font-bold text-slate-900"
                      placeholder="Order Inquiry"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="8"
                    className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-slate-900 transition-all text-sm font-bold text-slate-900 resize-none"
                    placeholder="How can ELVORA help you?"></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-slate-200 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
