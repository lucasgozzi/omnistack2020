import React, { useState, useEffect } from 'react';
import './styles.css';

function DevForm({ onSubmit }) {

    const [github_username, setGithubUsername] = useState('');
    const [techs, setTechs] = useState('');

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setLatitude(latitude);
                setLongitude(longitude);
            },
            (err) => {
                console.log(err);
            },
            {

            })
    }, []);

    async function handleAddDev(e) {
        e.preventDefault();
        await onSubmit({
            github_username,
            techs,
            latitude,
            longitude
        });
        setGithubUsername('');
        setTechs('');
    }

    return (
        <form onSubmit={handleAddDev} >
            <div className="input-block">
                <label htmlFor="github_username">Usuário do Github</label>
                <input name="github_username" id="github_username" required value={github_username}
                    onChange={e => setGithubUsername(e.target.value)} />
            </div>

            <div className="input-block">
                <label htmlFor="techs">Tecnologias</label>
                <input name="techs" id="techs" required value={techs}
                    onChange={e => setTechs(e.target.value)} />
            </div>

            <div className="input-block">
                <div className="input-group">
                    <label htmlFor="latitude">Latitude</label>
                    <input name="latitude" id="latitude" type="number"
                        value={latitude} required
                        onChange={e => setLatitude(e.target.value)} />

                    <label htmlFor="longitude">Longitude</label>
                    <input name="longitude" id="longitude" type="number"
                        value={longitude} required
                        onChange={e => setLongitude(e.target.value)} />
                </div>
            </div>

            <button type="submit">Salvar</button>
        </form>
    );
}

export default DevForm;