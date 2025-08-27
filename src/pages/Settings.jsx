import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Settings = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            const token = localStorage.getItem('token');
            if(!token) return;

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/getSettings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if(res.ok) {
                    setUsername(data.username || '');
                    setAvatar(data.avatar || '');
                    localStorage.setItem('avatar', data.avatar || '');
                }
                
            } catch (err) {
                console.error('Failed to fetch settings', err);
            }
        };

        fetchSettings();    
    }, []);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64Image = reader.result;
            setAvatar(base64Image);
            localStorage.setItem('avatar', base64Image);

            const token = localStorage.getItem('token');
            
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/api/settings/updateSettings`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({ avatar: base64Image }),
                });
            } catch (err) {
                console.error(err);
            }
        };

        if(file) {
            reader.readAsDataURL(file);
        }
    };

    const handleLogOut = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleNameChange = async () => {
        const token = localStorage.getItem('token');
        if(!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/updateSettings`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({ username })
        });

        const data = await res.json();
        if (res.ok) {
            toast.success('Username updated');
            localStorage.setItem('user', JSON.stringify({ name: data.user.username }));
        } else {
            toast.error(data.msg || 'Error updating username');
        }
    };

    const handleReset = () => {
        if(window.confirm('Reset all data? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow space-y-6 mt-6 h-screen">
            <h2 className="text-2xl font-bold text-indigo-700">⚙️ Settings</h2>

            <div className="space-y-2">
                <label className="block font-medium text-gray-700">Profile Avatar</label>

                <div className="relative w-20 h-20">
                    {avatar ? (
                        <>
                            <img
                                src={avatar}
                                alt="avatar" 
                                className="w-20 h-20 rounded-full object-cover shadow border border-gray-300"
                            />
                            <button
                                onClick={async () => {
                                    setAvatar('');
                                    localStorage.removeItem('avatar');

                                    const token = localStorage.getItem('token');
                                    try {
                                        await fetch(`${import.meta.env.VITE_API_URL}/api/settings/updateSettings`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-type': 'application/json',
                                                Authorization: `Bearer ${token}`
                                            },
                                            body: JSON.stringify({ avatar: '' })
                                        });
                                    } catch (err) {
                                        console.error('Error clearing avatar', err);
                                    }
                                }}
                                title="Remove avatar"
                                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white text-xl hover:bg-black/60 transition"
                            >
                                ×
                            </button>
                        </>    
                    ) :     (
                        <>
                            <label
                                htmlFor="avatar-upload"
                                className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-2xl border border-dashed border-gray-400 cursor-pointer hover:bg-gray-200"
                                title="Upload Avatar"
                            >
                                +
                            </label>

                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </>
                    )}
                </div>

                <label className="block font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    className="w-full border p-2 rounded-md"
                />

                <button
                    onClick={handleNameChange}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Save Name
                </button>
            </div>

            <div className="pt-4 border-t">
                <button
                    onClick={handleLogOut}
                    className="font-semibold text-red-500 hover:underline"
                >
                    🚪 Logout
                </button>
            </div>

            <div>
                <button
                    onClick={handleReset}
                    className="text-sm text-gray-500 hover:underline"
                >
                    ♻️ Reset All data
                </button>
            </div>
        </div>
    );
};

export default Settings;