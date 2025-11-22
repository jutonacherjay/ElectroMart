import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!token) {
      setMessage("You must login first");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("phone", form.phone);
    formData.append("email", form.email);

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/products/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Product added successfully!");
      
      // Reset form
      setForm({
        name: "",
        category: "",
        price: "",
        description: "",
        phone: user?.phone || "",
        email: user?.email || "",
      });
      setImage(null);
      setImagePreview(null);

      // Redirect to profile after 1.5 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error adding product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-2">Add New Product</h2>
        <p className="text-gray-600 mb-6">Fill in the details to list your product</p>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.includes("Error") || message.includes("must") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              name="name"
              placeholder="Enter product name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="Servo Motor">🛠️ Servo Motor</option>
              <option value="Jumper Wire">🔌 Jumper Wire</option>
              <option value="Breadboard">📋 Breadboard</option>
              <option value="Arduino">💻 Arduino</option>
              <option value="Raspberry Pi">🖥️ Raspberry Pi</option>
              <option value="Microcontroller">⚡ Microcontroller</option>
              <option value="Resistor">🔧 Resistor</option>
              <option value="Capacitor">🔋 Capacitor</option>
              <option value="LED">💡 LED</option>
              <option value="Sensor">📡 Sensor</option>
              <option value="Potentiometer">🎛️ Potentiometer</option>
              <option value="Transistor">🔹 Transistor</option>
              <option value="Diode">🔸 Diode</option>
              <option value="Switch">⚙️ Switch</option>
              <option value="Battery">🔋 Battery</option>
              <option value="Motor Driver">🚗 Motor Driver</option>
              <option value="Relay">🔄 Relay</option>
              <option value="Voltage Regulator">🔌 Voltage Regulator</option>
              <option value="IC Chip">📀 IC Chip</option>
              <option value="Crystal Oscillator">⏱️ Crystal Oscillator</option>
              <option value="Buzzer">🎵 Buzzer</option>
              <option value="Stepper Motor">🌀 Stepper Motor</option>
              <option value="Heat Sink">❄️ Heat Sink</option>
              <option value="USB Module">💾 USB Module</option>
              <option value="WiFi Module">🌐 WiFi Module</option>
              <option value="Bluetooth Module">📶 Bluetooth Module</option>
              <option value="OLED Display">🖲️ OLED Display</option>
              <option value="LCD Display">🖥️ LCD Display</option>
              <option value="Joystick">🕹️ Joystick</option>
              <option value="IR Sensor">📡 IR Sensor</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price (৳) *
            </label>
            <input
              name="price"
              placeholder="Enter price in Taka"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your product in detail..."
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              name="phone"
              placeholder="Enter contact number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
              {imagePreview ? (
                <div className="space-y-3">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-64 mx-auto rounded-lg shadow-md object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex justify-center text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-semibold text-blue-600 hover:text-blue-700">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              isSubmitting 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}