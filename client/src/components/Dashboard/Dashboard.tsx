import React, { useEffect, useState } from 'react';
import {
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { getSpotifyAccessToken } from '../../utils/commonFunctions';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Playlist, PlaylistEdit, PlaylistSubmit, Song, Track } from '../../constants/types';

const columns = [
    {
        Header: 'Title',
        accessor: 'title',
    },
    {
        Header: 'Description',
        accessor: 'description',
    },
    {
        Header: 'Duration',
        accessor: 'duration',
    },
    {
        Header: 'Actions',
        accessor: 'actions'
    },
];

const Dashboard: React.FC = () => {
    //Dashboard Comp Control Variables
    const [addPlaylistModal, setAddPlaylistOpen] = useState(false);
    const [songSearchResults, setSongSearchResults] = useState<Array<Song>>([]);
    const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm({
        defaultValues: {
            title: '',
            description: '',
            search: ''
        },
        mode: 'onBlur'
    });
    const [totalCurrPlaylists, setTotalCurrPlaylists] = useState<Array<Playlist>>([]);
    const [addedSongs, setAddedSongs] = useState<Array<{ title: string, artist: string, album: string }>>([]);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<{
        title: string;
        description: string;
        songs: Array<{ title: string; artist: string; album: string }>;
    } | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState<{ title: string } | null>(null);
    const [editPlaylistModal, setEditPlaylistModal] = useState<boolean>(false);
    const [currEditPlaylist, setCurrEditPlaylist] = useState<PlaylistEdit>();

    //Handles Playlist View Action
    const handleView = (playlist: {
        title: string;
        description: string;
        songs: Array<{ title: string; artist: string; album: string }>;
    }) => {
        setSelectedPlaylist(playlist);
        setViewModalOpen(true);
    };

    //Handles Playlist Delete Action
    const handleDelete = (playlist: { title: string }) => {
        setPlaylistToDelete(playlist);
        setDeleteModalOpen(true);
    };

    //Edit Modal Handlers
    const handleEditModalOpen = (row: PlaylistEdit) => {
        setCurrEditPlaylist(row);
        setEditPlaylistModal(true);
    }

    const handleEditClose = () => {
        setCurrEditPlaylist(undefined);
        setEditPlaylistModal(false);
    }

    //Fetches List of all the Playlists Created by the Current User
    const getAllPlaylistsAPI = async () => {
        try {
            const allCurrUserPlaylists = await fetch(`${import.meta.env.VITE_APP_BACK_END_URL}/users/get-playlists`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });
            const allCurrUserPlaylistsJson = await allCurrUserPlaylists.json();

            if (allCurrUserPlaylistsJson?.title === 'Total Playlists') {
                setTotalCurrPlaylists(allCurrUserPlaylistsJson?.playlists);
            }
        } catch (e) {
            console.log(e);
        }
    }

    //Creates a new Playlist for the Current User
    const createPlaylistAPI = async (reqBody: Playlist) => {
        try {
            const creatPlaylist = await fetch(`${import.meta.env.VITE_APP_BACK_END_URL}/users/create-playlist`, {
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });
            const createPlaylistJson = await creatPlaylist.json();

            if (createPlaylistJson?.title === 'Playlist Created') {
                toast.success(`${createPlaylistJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                getAllPlaylistsAPI();
                reset();
                handleClose();
            }
            else if (createPlaylistJson?.title === 'Playlist Exists') {
                toast.info(`${createPlaylistJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
            else {
                toast.error(`${createPlaylistJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                reset();
                handleClose();
            }

        } catch (e) {
            const error = e as Error;
            console.log(e);
            toast.error(`${error?.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    //Deletes the playlist for Current User
    const deletePlaylistAPI = async (reqBody: { title: string | undefined }) => {
        try {
            const deletePlaylist = await fetch(`${import.meta.env.VITE_APP_BACK_END_URL}/users/delete-playlist`, {
                method: 'DELETE',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });
            const deletePlaylistJson = await deletePlaylist.json();

            if (deletePlaylistJson?.title === 'Playlist Deleted') {
                toast.success(`${deletePlaylistJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                getAllPlaylistsAPI();
            }
            else {
                toast.error(`${deletePlaylistJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
        catch (e) {
            const error = e as Error;
            console.log(error);
            toast.error(`${error?.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    //Manages Playlist Edit for Curr User
    const editPlaylistAPI = async (reqBody: PlaylistEdit) => {
        try {
            const editPlaylist = await fetch(`${import.meta.env.VITE_APP_BACK_END_URL}/users/edit-playlist`, {
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });
            const editPlaylistJson = await editPlaylist.json();

            if (editPlaylistJson?.title === 'Playlist Edited') {
                toast.success(`${editPlaylistJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                getAllPlaylistsAPI();
                setEditPlaylistModal(false);
                setCurrEditPlaylist(undefined);
            }
            else {
                toast.info(`${editPlaylistJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setEditPlaylistModal(false);
                setCurrEditPlaylist(undefined);
            }

        } catch (e) {
            const error = e as Error;
            console.log(error);
            toast.error(`${error?.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setEditPlaylistModal(false);
            setCurrEditPlaylist(undefined);
        }
    }

    //Handles Song Search using Spotify API
    const handleSearch = async () => {
        try {
            const token = await getSpotifyAccessToken();
            const query = watch('search');

            if (!query) {
                toast.info('Please enter a Song name to Search.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                return;
            }

            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            console.log('Res-------------->', data);

            const results = data.tracks.items.map((item: Track) => ({
                title: item.name,
                artist: item.artists[0].name,
                album: item.album.name,
            }));

            setSongSearchResults(results);
        } catch (e) {
            console.log(e);
        }
    };

    //Handles Modal Close of Add New Modal & Resets State Variables 
    const handleClose = () => {
        setAddPlaylistOpen(false);
        setSongSearchResults([]);
        setAddedSongs([]);
        reset();
    };

    //Handles Add New Modal Submission
    const onSubmit = (data: PlaylistSubmit) => {
        const formData: Playlist = {
            ...data,
            songs: addedSongs,
        };
        createPlaylistAPI(formData);
        console.log('New Playlist:', data, formData);
    };

    const onEditSubmit = (data: PlaylistSubmit) => {
        editPlaylistAPI({ ...data, _id: currEditPlaylist?._id });
    }

    //Restricts Song Duplication if user tries to add same song multiple times
    const handleAddSong = (song: { title: string, artist: string, album: string }) => {
        if (addedSongs.some((item) => item.title === song.title && item.artist === song.artist)) {
            toast.info('This song has already been added to the playlist.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            setAddedSongs((prevSongs) => [...prevSongs, song]);
        }
    };

    const handlePlaylistDelete = (title: string | undefined) => {
        deletePlaylistAPI({ title });
    }

    //Fetches All Current User Playlists on Comp Mount
    useEffect(() => {
        getAllPlaylistsAPI();
    }, []);

    //Resets Form Instance
    useEffect(() => {
        if (editPlaylistModal) {
            reset({
                title: currEditPlaylist?.title,
                description: currEditPlaylist?.description,
            });
        }
        else {
            reset({
                title: '',
                description: '',
            });
        }
    }, [currEditPlaylist, reset, editPlaylistModal]);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                // pauseOnHover
                theme="dark"
            // transition: Bounce
            />

            <Box>
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#333' }}>
                    PLAYLIST DASHBOARD
                </Typography>

                <div style={{ marginRight: '15px', marginBottom: '15px', marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" onClick={() => setAddPlaylistOpen(true)} style={{ marginInline: '10px', padding: '5px 10px', background: '#333333', color: '#F5F5F5', borderRadius: '5px' }}>
                        Add New Playlist
                    </Button>
                </div>

                {totalCurrPlaylists.length ?
                    <TableContainer component={Paper} sx={{ cursor: 'pointer' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    {columns.map((column, index) => (
                                        <TableCell
                                            key={index}
                                            sx={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                color: '#555',
                                                textAlign: 'center',
                                                padding: '10px 15px',
                                            }}
                                        >
                                            {column.Header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {totalCurrPlaylists.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: '#fafafa',
                                            },
                                            '&:hover': {
                                                backgroundColor: '#f0f0f0',
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ textAlign: 'center', padding: '10px 15px' }}>
                                            {row.title}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '10px 15px' }}>
                                            {row.description}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '10px 15px' }}>
                                            {/* Currently Static, Will Add Dyanamic Total Songs Duration for Each Playlist */}
                                            {'10:36'}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '10px 15px' }}>
                                            <Box>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    sx={{ mr: 1, textTransform: 'none' }}
                                                    onClick={() => handleView({
                                                        title: row.title,
                                                        description: row.description,
                                                        songs: row.songs || []
                                                    })}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    size="small"
                                                    sx={{ mr: 1, textTransform: 'none' }}
                                                    onClick={
                                                        () => handleEditModalOpen({
                                                            _id: row._id as string,
                                                            title: row.title,
                                                            description: row.description,
                                                            songs: row.songs || [],
                                                        })}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    sx={{ textTransform: 'none' }}
                                                    onClick={() => handleDelete({
                                                        title: row.title,
                                                    })}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    :
                    <>
                        <Typography variant="h6" style={{ textAlign: 'center' }}>
                            Click on the
                            <span
                                style={{ marginInline: '4px', padding: '5px', background: '#333333', color: '#F5F5F5', borderRadius: '5px' }}>
                                Add New Playlist
                            </span>
                            button to begin adding playlists
                        </Typography>
                    </>
                }

                <Dialog
                    open={addPlaylistModal}
                    onClose={handleClose}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>New Playlist</DialogTitle>
                    <DialogContent>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: 'Title Field is required' }}
                            render={({ field }) => (
                                <div>
                                    <TextField
                                        {...field}
                                        autoFocus
                                        margin="dense"
                                        label="Title"
                                        fullWidth
                                        variant="outlined"
                                        error={!!errors.title}
                                    />
                                    {errors.title && <FormHelperText error>{errors.title.message}</FormHelperText>}
                                </div>
                            )}
                        />
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="dense"
                                    label="Description"
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
                            <TextField
                                {...register('search')}
                                margin="dense"
                                label="Search Songs"
                                variant="outlined"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ ml: 2, maxHeight: '40px' }}
                                onClick={handleSearch}
                                style={{ marginInline: '10px', padding: '5px 10px', background: '#333333', color: '#F5F5F5', borderRadius: '5px' }}
                            >
                                Search
                            </Button>
                        </Box>

                        {songSearchResults.length ?
                            <TableContainer component={Paper} sx={{ marginTop: '20px', maxHeight: '220px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Artist</TableCell>
                                            <TableCell>Album</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {songSearchResults.map((result, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{result.title}</TableCell>
                                                <TableCell>{result.artist}</TableCell>
                                                <TableCell>{result.album}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleAddSong(result)}
                                                    >
                                                        Add
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>

                                </Table>
                            </TableContainer>
                            : null
                        }

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={viewModalOpen}
                    onClose={() => setViewModalOpen(false)}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogContent>
                        {selectedPlaylist && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Title: {selectedPlaylist.title}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Description: {selectedPlaylist.description}
                                </Typography>
                                <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell>Title</TableCell>
                                                <TableCell>Artist</TableCell>
                                                <TableCell>Album</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedPlaylist.songs.map((song, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{song.title}</TableCell>
                                                    <TableCell>{song.artist}</TableCell>
                                                    <TableCell>{song.album}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setViewModalOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        {playlistToDelete && (
                            <Typography variant="body1">
                                Are you sure you want to delete the playlist titled "{playlistToDelete.title}"?
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setDeleteModalOpen(false);
                                handlePlaylistDelete(playlistToDelete?.title);
                            }}
                            color="primary"
                        >
                            Confirm
                        </Button>
                        <Button
                            onClick={() => setDeleteModalOpen(false)}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={editPlaylistModal}
                    onClose={handleEditClose}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>Edit Playlist</DialogTitle>
                    <DialogContent>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: 'Title Field is required' }}
                            defaultValue={currEditPlaylist?.title}
                            render={({ field }) => (
                                <div>
                                    <TextField
                                        {...field}
                                        autoFocus
                                        margin="dense"
                                        label="Title"
                                        fullWidth
                                        variant="outlined"
                                        error={!!errors.title}
                                    />
                                    {errors.title && <FormHelperText error>{errors.title.message}</FormHelperText>}
                                </div>
                            )}
                        />
                        <Controller
                            name="description"
                            control={control}
                            defaultValue={currEditPlaylist?.description}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="dense"
                                    label="Description"
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit(onEditSubmit)} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default Dashboard;
