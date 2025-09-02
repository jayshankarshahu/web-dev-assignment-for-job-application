import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = async function (data) {
        setIsSubmitting(true);

        try {
            // Create FormData object for file upload
            const formData = new FormData();

            console.log(data);

            // Append all form fields to FormData
            formData.append('name', data.schoolName);
            formData.append('address', data.schoolAddress);
            formData.append('city', data.city);
            formData.append('state', data.state);
            formData.append('contact', data.contact);
            formData.append('email_id', data.email);

            // Append image file if it exists
            if (data.image && data.image[0]) {
                formData.append('image', data.image[0]);
            }

            // Make API call
            const response = await fetch('/api/schools/add', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                // Success toast
                toast.success("School added successfully!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                reset(); // Reset the form
                console.log('School added:', result);
            } else {
                // Error toast
                toast.error(`❌ ${result.error || 'Failed to add school'}`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                console.error('API Error:', result);
            }

        } catch (error) {
            // Network error toast
            toast.error("🚫 Network error. Please check your connection and try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.error('Fetch Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const onError = function (errors) {
        // Show validation error toast
        toast.warn("⚠️ Please check the form for validation errors", {
            position: "top-right",
            autoClose: 4000,
        });

        console.log('Form validation errors:', errors);
    }

    return (

        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <form className="bg-gray-800 text-gray-300 rounded-lg shadow-lg max-w-lg w-full p-8 space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
                <h2 className="text-3xl font-semibold text-white mb-6 text-center">
                    Add New School
                </h2>

                <div>
                    <label htmlFor="schoolName" className="block mb-1 font-medium">
                        School Name *
                    </label>
                    <input
                        id="schoolName"
                        type="text"
                        placeholder="Enter school name"
                        className={`w-full bg-gray-700 border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.schoolName ? 'border-red-500' : 'border-gray-600'
                            }`}
                        {...register('schoolName', {
                            required: "School name is required",
                            minLength: {
                                value: 2,
                                message: "School name must be at least 2 characters"
                            },
                            maxLength: {
                                value: 100,
                                message: "School name must not exceed 100 characters"
                            },
                            pattern: {
                                value: /^[a-zA-Z\s.'-]+$/,
                                message: "School name can only contain letters, spaces, periods, apostrophes, and hyphens"
                            }
                        })}
                    />
                    {errors.schoolName && (
                        <p className="text-red-400 text-sm mt-1">{errors.schoolName.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="schoolAddress" className="block mb-1 font-medium">
                        School Full Address *
                    </label>
                    <textarea
                        id="schoolAddress"
                        placeholder="Enter full address"
                        className={`w-full bg-gray-700 border rounded px-3 py-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.schoolAddress ? 'border-red-500' : 'border-gray-600'
                            }`}
                        rows={3}
                        {...register('schoolAddress', {
                            required: "Address is required",
                            minLength: {
                                value: 10,
                                message: "Address must be at least 10 characters"
                            },
                            maxLength: {
                                value: 200,
                                message: "Address must not exceed 200 characters"
                            }
                        })}
                    />
                    {errors.schoolAddress && (
                        <p className="text-red-400 text-sm mt-1">{errors.schoolAddress.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="block mb-1 font-medium">
                            City *
                        </label>
                        <input
                            id="city"
                            type="text"
                            placeholder="City"
                            className={`w-full bg-gray-700 border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.city ? 'border-red-500' : 'border-gray-600'
                                }`}
                            {...register('city', {
                                required: "City is required",
                                minLength: {
                                    value: 2,
                                    message: "City name must be at least 2 characters"
                                },
                                maxLength: {
                                    value: 50,
                                    message: "City name must not exceed 50 characters"
                                },
                                pattern: {
                                    value: /^[a-zA-Z\s'-]+$/,
                                    message: "City name can only contain letters, spaces, apostrophes, and hyphens"
                                }
                            })}
                        />
                        {errors.city && (
                            <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="state" className="block mb-1 font-medium">
                            State *
                        </label>
                        <select
                            id="state"
                            className={`w-full bg-gray-700 border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.state ? 'border-red-500' : 'border-gray-600'
                                }`}
                            {...register('state', {
                                required: "Please select a state"
                            })}
                        >
                            <option value="">Select State</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Goa">Goa</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Manipur">Manipur</option>
                            <option value="Meghalaya">Meghalaya</option>
                            <option value="Mizoram">Mizoram</option>
                            <option value="Nagaland">Nagaland</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Sikkim">Sikkim</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Tripura">Tripura</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Uttarakhand">Uttarakhand</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Delhi">Delhi</option>
                        </select>
                        {errors.state && (
                            <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="contact" className="block mb-1 font-medium">
                        Contact *
                    </label>
                    <input
                        id="contact"
                        type="tel"
                        placeholder="Phone number"
                        className={`w-full bg-gray-700 border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.contact ? 'border-red-500' : 'border-gray-600'
                            }`}
                        maxLength="10"
                        {...register('contact', {
                            required: "Contact number is required",
                            pattern: {
                                value: /^[6-9]\d{9}$/,
                                message: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                            }
                        })}
                    />
                    {errors.contact && (
                        <p className="text-red-400 text-sm mt-1">{errors.contact.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block mb-1 font-medium">
                        Email ID *
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email address"
                        className={`w-full bg-gray-700 border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-600'
                            }`}
                        {...register('email', {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address"
                            },
                            maxLength: {
                                value: 100,
                                message: "Email must not exceed 100 characters"
                            }
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="image" className="block mb-1 font-medium">
                        School Image
                    </label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className={`w-full text-gray-400 bg-gray-700 border rounded px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.image ? 'border-red-500' : 'border-gray-600'
                            }`}
                        {...register('image', {
                            validate: {
                                fileSize: (files) => {
                                    if (files[0] && files[0].size > 5 * 1024 * 1024) {
                                        return "File size must be less than 5MB";
                                    }
                                    return true;
                                },
                                fileType: (files) => {
                                    if (files[0]) {
                                        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                                        if (!allowedTypes.includes(files[0].type)) {
                                            return "Only JPEG, JPG, PNG, and GIF files are allowed";
                                        }
                                    }
                                    return true;
                                }
                            }
                        })}
                    />
                    {errors.image && (
                        <p className="text-red-400 text-sm mt-1">{errors.image.message}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                        Supported formats: JPEG, JPG, PNG, GIF. Max size: 5MB
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-semibold py-3 rounded shadow transition-colors ${isSubmitting
                            ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                >
                    {isSubmitting ? 'Adding School...' : 'Add School'}
                </button>
            </form>

            {/* Toast Container - Required for toasts to display */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

        </div>


    )
}