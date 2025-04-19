// Módulo de integración con la base de datos SQL

// Función para cargar datos desde la base de datos SQL
function loadDataFromSQL() {
    console.log('Cargando datos desde la base de datos SQL...');
    
    // En un entorno real, aquí se realizaría una conexión a la base de datos
    // y se ejecutarían las consultas definidas en database.sql
    
    // Simulación de carga de datos desde SQL para demostración
    displaySQLStatus('Conectado a la base de datos');
    
    // Simular tiempo de carga
    setTimeout(() => {
        displaySQLStatus('Datos cargados correctamente');
    }, 1500);
}

// Función para guardar predicciones en la base de datos
function savePredictionToSQL(product, segmentPredictions) {
    console.log('Guardando predicciones en la base de datos SQL...');
    console.log('Producto:', product.name);
    console.log('Predicciones por segmento:', segmentPredictions);
    
    // En un entorno real, aquí se ejecutaría el procedimiento almacenado
    // update_product_predictions definido en database.sql
    
    displaySQLStatus('Predicciones guardadas en la base de datos');
    
    // Actualizar la interfaz para mostrar que los datos se han guardado
    document.getElementById('sql-last-update').textContent = new Date().toLocaleString();
}

// Función para ejecutar consultas SQL predefinidas
function runSQLQuery(queryType) {
    console.log('Ejecutando consulta SQL:', queryType);
    displaySQLStatus('Ejecutando consulta...');
    
    // Simular tiempo de ejecución de la consulta
    setTimeout(() => {
        let resultMessage = '';
        
        switch(queryType) {
            case 'top-products':
                resultMessage = 'Consulta completada: Top 10 productos con mayor probabilidad';
                break;
            case 'segment-analysis':
                resultMessage = 'Consulta completada: Análisis de segmentos de clientes';
                break;
            case 'category-trends':
                resultMessage = 'Consulta completada: Tendencias por categoría';
                break;
            default:
                resultMessage = 'Consulta completada';
        }
        
        displaySQLStatus(resultMessage);
    }, 1000);
}

// Función para mostrar el estado de la conexión SQL
function displaySQLStatus(message) {
    const statusElement = document.getElementById('sql-connection-status');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

// Función para inicializar la integración con SQL
function initSQLIntegration() {
    console.log('Inicializando integración con SQL...');
    
    // Agregar botones de acción SQL a la interfaz
    const sqlControlsContainer = document.createElement('div');
    sqlControlsContainer.className = 'sql-controls';
    sqlControlsContainer.innerHTML = `
        <h3>Integración con Base de Datos SQL</h3>
        <div class="sql-status">
            <span>Estado de conexión: </span>
            <span id="sql-connection-status">No conectado</span>
        </div>
        <div class="sql-status">
            <span>Última actualización: </span>
            <span id="sql-last-update">-</span>
        </div>
        <div class="button-group">
            <button id="load-sql-button" class="sql-button">Cargar Datos SQL</button>
            <button id="save-sql-button" class="sql-button">Guardar Predicciones</button>
        </div>
        <div class="button-group">
            <button id="query-top-products" class="sql-button">Consultar Top Productos</button>
            <button id="query-segments" class="sql-button">Analizar Segmentos</button>
            <button id="query-categories" class="sql-button">Tendencias por Categoría</button>
        </div>
    `;
    
    // Insertar controles SQL después de la sección de predicción
    const predictionSection = document.querySelector('.dashboard-section:nth-child(2)');
    if (predictionSection) {
        predictionSection.appendChild(sqlControlsContainer);
        
        // Configurar eventos para los botones SQL
        document.getElementById('load-sql-button').addEventListener('click', loadDataFromSQL);
        document.getElementById('save-sql-button').addEventListener('click', function() {
            // Obtener el producto seleccionado y las predicciones actuales
            if (selectedProduct && predictionResults.length > 0) {
                savePredictionToSQL(selectedProduct, predictionResults);
            } else {
                alert('Primero debe realizar una predicción');
            }
        });
        
        // Configurar eventos para los botones de consulta
        document.getElementById('query-top-products').addEventListener('click', function() {
            runSQLQuery('top-products');
        });
        
        document.getElementById('query-segments').addEventListener('click', function() {
            runSQLQuery('segment-analysis');
        });
        
        document.getElementById('query-categories').addEventListener('click', function() {
            runSQLQuery('category-trends');
        });
    }
    
    // Agregar estilos CSS para los controles SQL
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .sql-controls {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .sql-status {
            margin-bottom: 15px;
            font-size: 14px;
        }
        
        .sql-button {
            background-color: #4a6fa5;
            color: white;
            border: none;
            padding: 8px 15px;
            margin-right: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .sql-button:hover {
            background-color: #3a5a80;
        }
        
        #sql-connection-status {
            font-weight: bold;
        }
    `;
    document.head.appendChild(styleElement);
}

// Inicializar la integración con SQL cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para asegurarse de que el resto de la aplicación se ha cargado
    setTimeout(initSQLIntegration, 500);
});

// Exportar funciones para uso en otros módulos
window.sqlIntegration = {
    loadData: loadDataFromSQL,
    savePrediction: savePredictionToSQL,
    runQuery: runSQLQuery
};