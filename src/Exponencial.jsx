import  { useEffect, useState } from 'react';
import FrequencyChart from './components/FrecuencyChart'; 
import TablaFrecuencias from './components/TablaFrecuencias';
import TablaFrecuenciasChiCuadrado from './components/TablaFrecuenciasChiCuadrado';
import TablaNumerosAleatorios from './components/TablaNumerosAleatorios';
import jStat from 'jstat';

function Exponencial() {
  const [media, setMedia] = useState('');
  const [lambda, setLambda] = useState('');
  const [numerosAleatorios, setNumerosAleatorios] = useState([]);
  const [cantIntervalos, setCantIntervalos] = useState(5);
  const [frecuencias, setFrecuencias] = useState([]);
  const [cantMuestra, setCantMuestra] = useState(10000);
  const [resultadoPrueba, setResultadoPrueba] = useState(null); // Aceptar o rechazar la hipótesis
  const [chiCuadrado, setChiCuadrado] = useState(null);
  const [chiTabulado, setChiTabulado] = useState(null);
  const [frecChi, setFrecChi] = useState(
    {
      fo: [],
      fe: []
    }
  );

  useEffect(() => {
    if (numerosAleatorios.length > 0) {
      calcularFrecuencias(numerosAleatorios, cantIntervalos);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numerosAleatorios, cantIntervalos]);

  const generarNumerosAleatorios = (muestra) => {
    if (!media) {
      alert('Por favor ingrese un valor de media.');
      return;
    }

    const lambda = 1 / media;
    setLambda(lambda);
    const nuevosNumerosAleatorios = [];

    for (let i = 0; i < muestra; i++) {
      const U = Math.random();
      const x = -Math.log(1 - U) / lambda; // Función inversa de la distribución exponencial
      nuevosNumerosAleatorios.push(x.toFixed(4)); // Redondeamos a 4 decimales
    }
    setNumerosAleatorios(nuevosNumerosAleatorios);

  };

  const handleChangeMedia = (event) => {
    setMedia(event.target.value);
  };

  const handleChangeIntervalos = (event) => {
    setCantIntervalos(parseInt(event.target.value, 10));
  };

  const handleChangeMuestra = (event) => {
    setCantMuestra(parseInt(event.target.value, 10));
  };

  const calcularFrecuenciasEsperadas = (k, min, max, numeros, lambda) => {
    const amplitud = (max - min) / k;
    const frecuenciasEsperadas = [];
    for (let i = 0; i < k; i++) {
        let intervaloInicio = min + (i * amplitud);
        let intervaloFin = intervaloInicio + amplitud;

        // Calcular la probabilidad acumulada para los límites del intervalo
        const probInicio = 1 - Math.exp(-lambda * intervaloFin);
        const probFin = 1 - Math.exp(-lambda * intervaloInicio);

        // Frecuencia esperada es la probabilidad del intervalo multiplicada por la cantidad total de números generados
        let frecuenciaEsperada = parseFloat((probInicio - probFin) * numeros.length);

        frecuenciasEsperadas.push(parseFloat(frecuenciaEsperada.toFixed(2)));
      }

    return frecuenciasEsperadas;
};


  const calcularFrecuencias = (numeros, k) => {
    const max = Math.max(...numeros);
    const min = Math.min(...numeros);

    const rango = max - min;
    const amplitud = rango / k;

    const frecuencias = [];

    for (let i = 0; i < k; i++) {
      const intervaloInicio = min + i * amplitud - (0.000001);
      const intervaloFin = intervaloInicio + amplitud;

      const frecuencia = numeros.filter((numero) => numero >= intervaloInicio && numero < intervaloFin).length;

      
      
      frecuencias.push({
        intervaloSuperior: parseFloat(intervaloFin.toFixed(2)),
        intervaloInferior: parseFloat(intervaloInicio.toFixed(2)),
        frecuencia: parseFloat(frecuencia)
      });
    }

    const frecuenciasEsperadas = calcularFrecuenciasEsperadas(k, min, max, numeros, lambda);

    for (let i = frecuencias.length - 1; i > 0; i--) {
      while (isNaN(frecuenciasEsperadas[i]) || frecuenciasEsperadas[i] < 5) {
        frecuencias[i - 1].frecuencia += parseFloat(frecuencias[i].frecuencia);
        const nuevaFrecuenciaEsperada = parseFloat((frecuenciasEsperadas[i - 1] + frecuenciasEsperadas[i]).toFixed(2));
        frecuenciasEsperadas[i - 1] = isNaN(nuevaFrecuenciaEsperada) ? 0 : nuevaFrecuenciaEsperada;
        frecuencias.splice(i, 1);
        frecuenciasEsperadas.splice(i, 1);
        i = frecuencias.length - 1;
      }
    }
    
    const frecuenciasObservadas = frecuencias.map((frecuencia) => frecuencia.frecuencia);
    

    
    

    setFrecChi({
      fo: frecuenciasObservadas,
      fe: frecuenciasEsperadas
    });
    
    const chiCuadrado = calcularChiCuadrado(frecuenciasObservadas, frecuenciasEsperadas);


    // Determinar el resultado de la prueba
    const gradosLibertad = k - 2;
    const valorCritico = jStat.chisquare.inv(0.95, gradosLibertad); 
    setChiTabulado(valorCritico);
    const resultado = chiCuadrado <= valorCritico ? 'Aceptar' : 'Rechazar';
    setResultadoPrueba(resultado);
    console.log('res', resultado);

    setFrecuencias(frecuencias);
    setChiCuadrado(chiCuadrado);
  };

  const calcularChiCuadrado = (observadas, esperadas) => {
    let chiCuadrado = 0;
    for (let i = 0; i < observadas.length; i++) {
      if (isFinite(esperadas[i])) { // Verificar si es un número válido
        chiCuadrado += Math.pow(observadas[i] - esperadas[i], 2) / esperadas[i];
      }
    }
    return chiCuadrado;
  };
  
  

  return (
    <div className='exponencial'>
      <h2>Exponencial</h2>
      <div className='form'>
        <div className='form-group'>
          <label htmlFor="media">Ingrese el valor de la media:</label>
          <input
            type="number"
            id="media"
            value={media}
            onChange={handleChangeMedia}
            placeholder="Media"
          />
        </div>
      <div className='form-group'>
        <label htmlFor="intervalos">Seleccione la cantidad de intervalos:</label>
          <input
            type="number"
            id="intervalos"
            value={cantIntervalos}
            onChange={handleChangeIntervalos}
          />
      </div>
        <div className="form-group">
          <label htmlFor="muestra">Seleccione la cantidad de muestra:</label>
          <input
            type="number"
            id="muestra"
            value={cantMuestra}
            onChange={handleChangeMuestra}
          />
        </div>
      </div>
     
      <button onClick={() => generarNumerosAleatorios(cantMuestra)}>Generar números aleatorios</button>
      
      {media && <p>Media ingresada: {media}</p>}
      {numerosAleatorios.length > 0 && (
        <div>
          <h3>Números aleatorios generados:</h3>
          {<TablaNumerosAleatorios numerosAleatorios={numerosAleatorios}/>}
          <h3>Gráfico de Frecuencias:</h3>
          <FrequencyChart numbers={numerosAleatorios} intervals={cantIntervalos} />
          <div className='chi'>
          <div>
            <h3>Chi Cuadrado:</h3>
            <p>{chiCuadrado !== null ? chiCuadrado.toFixed(4) : 'Calculando...'}</p>
          </div>
          <div>
            <h3>Chi Tabulado:</h3>
            <p>{chiTabulado !== null ? chiTabulado.toFixed(4) : 'Calculando...'}</p>
          </div>
          <h3>Resultado de la prueba:</h3>
          <p>{resultadoPrueba !== null ? resultadoPrueba : 'Calculando...'}</p>
        </div>



          <div className='tablas'>
            <div>
              <h3>Frecuencias:</h3>
              {<TablaFrecuencias frecuencias={frecuencias}/>}
            </div>
            <div>
            <h3>Frecuencias Chi Cuadrado:</h3>
              <TablaFrecuenciasChiCuadrado  frecuenciasObservadas={frecChi.fo} frecuenciasEsperadas={frecChi.fe} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Exponencial;
