import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('https://malshe-infrastructure-admin-panel.vercel.app/items'); // Ensure this URL is correct
            const data = response.data;
            console.log(data); // Log to inspect the response data
            // Ensure data is an array, or adjust based on the actual structure
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('There was an error fetching the items!', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('link', link);
        formData.append('image', image);

        try {
            await axios.post('https://malshe-infrastructure-admin-panel.vercel.app', formData);
            alert('Upload successful!');
            fetchItems(); // Refresh items after upload
        } catch (error) {
            console.error('There was an error uploading the data!', error);
        }
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
        setFileName(e.target.files[0]?.name || 'No file chosen');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4 flex-col">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Upload New Item</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md mt-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium">Link</label>
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md mt-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Image</label>
                        <div className="flex items-center">
                            <label className="bg-blue-700 text-white p-2 rounded-md cursor-pointer hover:bg-blue-800 transition duration-300">
                                Choose File
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            <span className="ml-3 text-gray-600">{fileName}</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-700 text-white p-3 rounded-md hover:bg-blue-800 transition duration-300"
                    >
                        Upload
                    </button>
                </form>
            </div>

            {/* Display Uploaded Items */}
            <div className="mt-8 max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Uploaded Items</h2>
                <div className="space-y-4">
                    {Array.isArray(items) && items.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-medium">{item.title}</h3>
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                {item.link}
                            </a>
                            {item.imageUrl && (
                                <img
                                    src={`https://malshe-infrastructure-admin-panel.vercel.app${item.imageUrl}`}
                                    alt={item.title}
                                    className="mt-2 rounded"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
