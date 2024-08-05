// AddJobTypeForm.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';

const API_URL = 'http://192.168.0.16:5000/api/add-job-type';

const AddJobTypeForm: React.FC = () => {
    const [jobType, setJobType] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (jobType.trim() === '') {
            setError('Please enter a job type.');
            return;
        }

        try {
            await axios.post(API_URL, { jobType });
            setSuccess('Job type added successfully.');
            setJobType(''); // Reset the input field
            setError(null); // Clear previous errors
        } catch (error) {
            console.error('Error adding job type:', error);
            setError('Failed to add job type. Please try again.');
        }
    };

    return (
        <Container>
            <Typography variant="h5" gutterBottom>
                Add New Job Type
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Job Type"
                    variant="outlined"
                    fullWidth
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    margin="normal"
                />
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="primary">{success}</Typography>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Add Job Type
                </Button>
            </form>
        </Container>
    );
};

export default AddJobTypeForm;
