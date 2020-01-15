import React, { useEffect, useState } from 'react';
import api from './services/api';
import DevItem from './components/DevItem/index';
import DevForm from './components/DevForm/index';
import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';


function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      let res = null;
      try {
        res = await api.get('/devs');
      } catch (e) {
        showToast("Servidor não pode responder, por favor tentar mais tarde");
        return;
      }
      setDevs(res.data);
    }

    loadDevs();
  }, []);

  function showToast(text) {
    var x = document.getElementById("snackbar");
    x.innerHTML = text;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }

  async function handleSubmit(data) {
    let obj = devs.find(o => o.github_username === data.github_username);
    if (!obj) {
      let res = null;
      try {
        res = await api.post('/devs', data);
      } catch (e) {
        showToast("Servidor não pode responder, por favor tentar mais tarde");
        return;
      }
      if (res.status !== 200) {
        setDevs([...devs, res.data]);
      } else {
        showToast("Ocorreu um erro na aplicação");
      }
    }
    else {
      showToast("Dev já foi criado na aplicação.");
    }
  };

  return (
    <div id="app">
      <div id="snackbar">Some text some message..</div>
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleSubmit} />
      </aside>
      <main>
        <ul>
          {devs.map(dev => <DevItem dev={dev} key={dev._id} />)}
        </ul>
      </main>
    </div>
  );
}

export default App;
