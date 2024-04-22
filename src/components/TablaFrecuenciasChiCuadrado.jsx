/* eslint-disable react/prop-types */
function TablaFrecuenciasChiCuadrado({ frecuenciasObservadas, frecuenciasEsperadas }) {
    return (
      <table>
        <thead>
          <tr>
            <th>Frecuencias observadas</th>
            <th>Frecuencias esperadas</th>
          </tr>
        </thead>
        <tbody>
          {frecuenciasObservadas.map((frecuenciaObs, index) => (
            <tr key={index}>
              <td>{frecuenciaObs}</td>
              <td>{frecuenciasEsperadas[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  
  export default TablaFrecuenciasChiCuadrado;
  