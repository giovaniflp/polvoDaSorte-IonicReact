import { useEffect, useState } from 'react';
import { AdLoadInfo, AdMob, AdOptions, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import './Home.css';

function randomizeResponse(){
  const responses = [
    'Sim',
    'Não',
    'Talvez',
    'Não sei',
    'Claro',
    'Com certeza',
    'Jamais',
    'Nunca',
    'Óbvio',
    'Sem dúvidas'
  ];
  const randomIndex = Math.floor(Math.random() * responses.length);
  console.log(responses[randomIndex]);
  return responses[randomIndex];
}

const Home: React.FC = () => {

  // Inicializa o AdMob
  AdMob.initialize()  
  
  AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo)=>{
    console.log(info)
  })
  
  // Define as configurações da chave do anúncio intersticial
  const options: AdOptions ={
    adId:'ca-app-pub-6872790638818192/4197557814'
  }
  
  // Carrega o anúncio intersticial e seta as opções
  AdMob.prepareInterstitial(options);
  
  const [response, setResponse] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Impede o comportamento padrão do envio do formulário
    if (isThinking) return; // Se já estiver pensando, não faz nada
    if (inputValue.trim().endsWith('?')) { // Verifica se há um ponto de interrogação no final do texto
      setIsThinking(true); // Ativa o estado "pensando"
      setTimeout(() => {
        const respostaAleatoria = randomizeResponse();
        setResponse(respostaAleatoria);
        setIsThinking(false); // Desativa o estado "pensando" após definir a resposta
      }, 2000); // Simula um atraso de 2 segundos antes de mostrar a resposta
    } else {
      alert('Sua pergunta deve terminar com um ponto de interrogação (?)');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Só mostra o anúncio se o usuário clicar no botão de perguntar
  const handleShowAd = () => {
    AdMob.showInterstitial();
  };

  return (
    <div className='flex flex-col h-screen bg-black text-white justify-center items-center'>
      <header><h1 className='text-4xl text-center'>Pergunte ao polvo!</h1></header>
      <figure><img className='w-40' src="polvofofo.png" alt="" /></figure>
      {isThinking && <div><strong>Pensando...</strong></div>}
      {response && !isThinking && <div className='text-green-500'><strong className='text-white'>Resposta: </strong> {response}</div>}
      <form className='flex flex-col items-center my-8' onSubmit={handleSubmit}>
        <input placeholder='Insira aqui sua pergunta!' required className='p-2 w-60 rounded-xl text-center text-black' type="text" name="text" id="text" value={inputValue} onChange={handleInputChange} />
        <button className='bg-green-500 hover:bg-green-700 duration-500 p-2 mt-2 rounded-xl w-24 text-center' type="submit" onClick={handleShowAd}>Perguntar</button>
      </form>
    </div>
  );
};

export default Home;
