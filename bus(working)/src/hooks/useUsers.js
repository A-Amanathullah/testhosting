import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from "../utils/auth";

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // const token = localStorage.getItem('auth_token'); // Adjust based on how you store the token

        axios.get('http://localhost:8000/api/users', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching users:', err);
                setError(err);
                setLoading(false);
            });
    }, []);

    return { users, loading, error };
};

export default useUsers;