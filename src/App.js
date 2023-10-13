import { useEffect, useState } from 'react';
import './App.css';
import Auth from './components/Auth';
import { auth, db, storage } from './config/firebase'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { upload } from '@testing-library/user-event/dist/upload';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([]);

  //new movies states
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newRecievedAnOscar, setNewRecievedAnOscar] = useState(false);

  //update state
  const [updatedTitle, setUpdatedTitle] = useState('');

  //file upload state
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: newRecievedAnOscar,
        userId: auth?.currentUser?.uid
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  }

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
  }

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, {title: updatedTitle});
  }

  const uploadFile = async () => {
    if(!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch(err) {
      console.error(err);
    }
  }

  const getMovieList = async () => {
    //read the data
    //set the movie list
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getMovieList();
  }, [onSubmitMovie])

  return (
    <div className="App">
      <h1>Firebase</h1>
      <Auth />
      <div>
        <input
          type="text" placeholder='Movie title'
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder='Release Date'
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          onChange={(e) => setNewRecievedAnOscar(e.target.checked)}
          checked={newRecievedAnOscar}
        />
        <label>
          Recieve an Oscar
        </label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>

      <div>
        {movieList.map(movie => (
          <div key={movie.id}>
            <h1 style={{ color: movie.receivedAnOscar ? 'gold' : 'gray' }}>{movie.title}</h1>
            <p>{movie.releaseDate}</p>
            <p>{movie.id}</p>
            <button onClick={() => deleteMovie(movie.id)}>delete Movie</button>

            <input type="text" placeholder='New Title...' onChange={(e) => setUpdatedTitle(e.target.value)}/>
            <button onClick={() => updateMovieTitle(movie.id)}>Update Title</button>
          </div>
        ))}
      </div>

      <div>
        <input type="file" onChange={e => setFileUpload(e.target.files[0])}/>
        <button onClick={uploadFile}>Upload file</button>
      </div>
    </div>
  );
}

export default App;
