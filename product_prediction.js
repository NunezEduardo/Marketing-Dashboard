// Algoritmo de predicción de respuesta a productos usando técnicas de IA

// Lista de productos para predicción
const productList = [
    { id: 1, name: "Vino Reserva Premium", category: "Vinos", price: 45.99 },
    { id: 2, name: "Vino Blanco Chardonnay", category: "Vinos", price: 22.50 },
    { id: 3, name: "Vino Tinto Merlot", category: "Vinos", price: 18.75 },
    { id: 4, name: "Champagne Brut", category: "Vinos", price: 39.99 },
    { id: 5, name: "Vino Rosado", category: "Vinos", price: 15.50 },
    { id: 6, name: "Manzanas Orgánicas (kg)", category: "Frutas", price: 4.99 },
    { id: 7, name: "Fresas Premium (caja)", category: "Frutas", price: 6.75 },
    { id: 8, name: "Uvas Sin Semilla (kg)", category: "Frutas", price: 5.25 },
    { id: 9, name: "Naranjas Zumo (kg)", category: "Frutas", price: 3.99 },
    { id: 10, name: "Frutas Tropicales Surtidas", category: "Frutas", price: 12.50 },
    { id: 11, name: "Filete de Ternera Premium", category: "Carne", price: 28.99 },
    { id: 12, name: "Pechuga de Pollo Orgánica", category: "Carne", price: 9.75 },
    { id: 13, name: "Costillas de Cerdo", category: "Carne", price: 15.50 },
    { id: 14, name: "Hamburguesas Gourmet", category: "Carne", price: 12.99 },
    { id: 15, name: "Cordero Importado", category: "Carne", price: 32.50 },
    { id: 16, name: "Salmón Fresco Filete", category: "Pescado", price: 22.99 },
    { id: 17, name: "Gambas Grandes (kg)", category: "Pescado", price: 29.50 },
    { id: 18, name: "Lubina Entera", category: "Pescado", price: 18.75 },
    { id: 19, name: "Atún Fresco", category: "Pescado", price: 24.99 },
    { id: 20, name: "Mariscos Surtidos", category: "Pescado", price: 35.50 },
    { id: 21, name: "Bombones Surtidos", category: "Dulces", price: 15.99 },
    { id: 22, name: "Tarta de Chocolate Gourmet", category: "Dulces", price: 28.50 },
    { id: 23, name: "Galletas Artesanales", category: "Dulces", price: 8.75 },
    { id: 24, name: "Helado Premium", category: "Dulces", price: 12.99 },
    { id: 25, name: "Pastel de Frutas", category: "Dulces", price: 22.50 },
    { id: 26, name: "Pulsera de Oro 18k", category: "Oro", price: 450.00 },
    { id: 27, name: "Collar de Oro con Diamantes", category: "Oro", price: 1250.00 },
    { id: 28, name: "Anillo de Oro Rosa", category: "Oro", price: 350.00 },
    { id: 29, name: "Pendientes de Oro", category: "Oro", price: 280.00 },
    { id: 30, name: "Reloj Chapado en Oro", category: "Oro", price: 550.00 },
    // Más productos de vinos
    { id: 31, name: "Vino Cabernet Sauvignon", category: "Vinos", price: 32.99 },
    { id: 32, name: "Vino Pinot Noir", category: "Vinos", price: 28.50 },
    { id: 33, name: "Vino Sauvignon Blanc", category: "Vinos", price: 19.99 },
    { id: 34, name: "Vino Espumoso", category: "Vinos", price: 24.75 },
    { id: 35, name: "Vino Dulce Postre", category: "Vinos", price: 17.50 },
    // Más productos de frutas
    { id: 36, name: "Plátanos Orgánicos (kg)", category: "Frutas", price: 3.50 },
    { id: 37, name: "Kiwis (kg)", category: "Frutas", price: 4.25 },
    { id: 38, name: "Mangos Maduros", category: "Frutas", price: 5.99 },
    { id: 39, name: "Piña Natural", category: "Frutas", price: 4.50 },
    { id: 40, name: "Arándanos (caja)", category: "Frutas", price: 7.99 },
    // Más productos de carne
    { id: 41, name: "Lomo de Cerdo", category: "Carne", price: 14.99 },
    { id: 42, name: "Carne Picada Premium", category: "Carne", price: 8.50 },
    { id: 43, name: "Pavo Entero", category: "Carne", price: 45.00 },
    { id: 44, name: "Chuletas de Cordero", category: "Carne", price: 22.99 },
    { id: 45, name: "Entrecot Madurado", category: "Carne", price: 35.50 },
    // Más productos de pescado
    { id: 46, name: "Dorada Fresca", category: "Pescado", price: 16.99 },
    { id: 47, name: "Pulpo Gallego", category: "Pescado", price: 32.50 },
    { id: 48, name: "Merluza Filete", category: "Pescado", price: 14.75 },
    { id: 49, name: "Mejillones Frescos (kg)", category: "Pescado", price: 8.99 },
    { id: 50, name: "Bacalao Fresco", category: "Pescado", price: 19.50 },
    // Más productos de dulces
    { id: 51, name: "Cupcakes Gourmet (pack 6)", category: "Dulces", price: 18.99 },
    { id: 52, name: "Macarons Franceses", category: "Dulces", price: 24.50 },
    { id: 53, name: "Chocolate Negro 85%", category: "Dulces", price: 6.75 },
    { id: 54, name: "Trufas Artesanales", category: "Dulces", price: 22.99 },
    { id: 55, name: "Turrón Artesanal", category: "Dulces", price: 12.50 },
    // Más productos de oro
    { id: 56, name: "Brazalete de Oro", category: "Oro", price: 380.00 },
    { id: 57, name: "Cadena de Oro", category: "Oro", price: 320.00 },
    { id: 58, name: "Colgante de Oro", category: "Oro", price: 250.00 },
    { id: 59, name: "Tobillera de Oro", category: "Oro", price: 180.00 },
    { id: 60, name: "Gemelos de Oro", category: "Oro", price: 220.00 },
    // Productos adicionales variados
    { id: 61, name: "Aceite de Oliva Premium", category: "Gourmet", price: 18.99 },
    { id: 62, name: "Queso Curado Artesanal", category: "Gourmet", price: 22.50 },
    { id: 63, name: "Jamón Ibérico", category: "Gourmet", price: 95.00 },
    { id: 64, name: "Café Gourmet (250g)", category: "Gourmet", price: 14.75 },
    { id: 65, name: "Té Premium Surtido", category: "Gourmet", price: 16.99 },
    { id: 66, name: "Smartphone Última Generación", category: "Electrónica", price: 899.00 },
    { id: 67, name: "Tablet HD", category: "Electrónica", price: 450.00 },
    { id: 68, name: "Auriculares Inalámbricos", category: "Electrónica", price: 129.99 },
    { id: 69, name: "Smartwatch", category: "Electrónica", price: 199.50 },
    { id: 70, name: "Altavoz Bluetooth", category: "Electrónica", price: 85.00 },
    { id: 71, name: "Perfume Exclusivo", category: "Belleza", price: 120.00 },
    { id: 72, name: "Set Cremas Premium", category: "Belleza", price: 95.50 },
    { id: 73, name: "Maquillaje Profesional", category: "Belleza", price: 65.99 },
    { id: 74, name: "Tratamiento Capilar", category: "Belleza", price: 45.00 },
    { id: 75, name: "Afeitadora Eléctrica", category: "Belleza", price: 150.00 },
    { id: 76, name: "Zapatillas Deportivas", category: "Moda", price: 89.99 },
    { id: 77, name: "Bolso de Diseño", category: "Moda", price: 250.00 },
    { id: 78, name: "Gafas de Sol Premium", category: "Moda", price: 175.50 },
    { id: 79, name: "Chaqueta de Cuero", category: "Moda", price: 320.00 },
    { id: 80, name: "Reloj de Diseño", category: "Moda", price: 450.00 },
    { id: 81, name: "Juego de Sábanas Premium", category: "Hogar", price: 120.00 },
    { id: 82, name: "Vajilla Completa", category: "Hogar", price: 250.00 },
    { id: 83, name: "Robot Aspirador", category: "Hogar", price: 350.00 },
    { id: 84, name: "Juego de Toallas Lujo", category: "Hogar", price: 85.50 },
    { id: 85, name: "Cafetera Automática", category: "Hogar", price: 199.99 },
    { id: 86, name: "Experiencia Spa", category: "Experiencias", price: 150.00 },
    { id: 87, name: "Cena Gourmet para Dos", category: "Experiencias", price: 200.00 },
    { id: 88, name: "Vuelo en Globo", category: "Experiencias", price: 280.00 },
    { id: 89, name: "Curso de Cocina", category: "Experiencias", price: 120.00 },
    { id: 90, name: "Fin de Semana Rural", category: "Experiencias", price: 350.00 },
    { id: 91, name: "Libro Edición Coleccionista", category: "Cultura", price: 65.00 },
    { id: 92, name: "Entradas Teatro VIP", category: "Cultura", price: 120.00 },
    { id: 93, name: "Vinilo Edición Limitada", category: "Cultura", price: 45.50 },
    { id: 94, name: "Suscripción Premium Música", category: "Cultura", price: 99.99 },
    { id: 95, name: "Curso Online Premium", category: "Cultura", price: 150.00 },
    { id: 96, name: "Bicicleta Montaña", category: "Deportes", price: 650.00 },
    { id: 97, name: "Raqueta Tenis Profesional", category: "Deportes", price: 180.00 },
    { id: 98, name: "Set Golf Premium", category: "Deportes", price: 950.00 },
    { id: 99, name: "Equipo Buceo Completo", category: "Deportes", price: 450.00 },
    { id: 100, name: "Tabla Paddle Surf", category: "Deportes", price: 550.00 }
];

// Variables para el modelo de predicción
let model = null;
let selectedProduct = null;
let predictionResults = [];

// Inicializar el módulo de predicción cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el selector de productos
    initializeProductSelector();
    
    // Configurar eventos de botones
    document.getElementById('predict-button').addEventListener('click', predictProductResponse);
    document.getElementById('train-model-button').addEventListener('click', trainModel);
});

// Función para inicializar el selector de productos
function initializeProductSelector() {
    const productSelector = document.getElementById('product-selector');
    
    // Agrupar productos por categoría
    const productsByCategory = {};
    productList.forEach(product => {
        if (!productsByCategory[product.category]) {
            productsByCategory[product.category] = [];
        }
        productsByCategory[product.category].push(product);
    });
    
    // Crear grupos de opciones por categoría
    Object.keys(productsByCategory).forEach(category => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;
        
        productsByCategory[category].forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} - $${product.price.toFixed(2)}`;
            optgroup.appendChild(option);
        });
        
        productSelector.appendChild(optgroup);
    });
    
    // Evento de cambio de producto
    productSelector.addEventListener('change', function() {
        const productId = parseInt(this.value);
        selectedProduct = productList.find(p => p.id === productId);
        
        // Actualizar información del producto
        updateProductInfo();
    });
    
    // Seleccionar el primer producto por defecto
    if (productList.length > 0) {
        productSelector.value = productList[0].id;
        selectedProduct = productList[0];
        updateProductInfo();
    }
}

// Función para actualizar la información del producto seleccionado
function updateProductInfo() {
    if (!selectedProduct) return;
    
    document.getElementById('product-name').textContent = selectedProduct.name;
    document.getElementById('product-category').textContent = selectedProduct.category;
    document.getElementById('product-price').textContent = `$${selectedProduct.price.toFixed(2)}`;
    
    // Si ya hay un modelo entrenado, mostrar predicción para este producto
    if (model) {
        predictProductResponse();
    }
}

// Función para entrenar el modelo de predicción
function trainModel() {
    // Mostrar indicador de carga
    document.getElementById('model-status').textContent = 'Entrenando modelo...';
    document.getElementById('model-status').className = 'status training';
    
    // Simular tiempo de entrenamiento (en una aplicación real, esto sería un proceso asíncrono)
    setTimeout(() => {
        // Crear modelo de regresión logística simple
        model = {
            // Coeficientes del modelo (en una aplicación real, estos se calcularían con algoritmos de ML)
            intercept: -2.5,
            coefficients: {
                age: 0.02,        // Edad tiene un efecto positivo pequeño
                income: 0.00002,   // Ingresos tienen un efecto positivo
                totalSpending: 0.0005, // Gasto total tiene un efecto positivo
                recency: -0.01,    // Recencia (días desde última compra) tiene efecto negativo
                children: -0.2,     // Tener niños tiene efecto ligeramente negativo
                webPurchases: 0.1,  // Compras web tienen efecto positivo
                categoryAffinity: 0.8, // Afinidad a la categoría tiene efecto positivo fuerte
                priceRatio: -0.5    // Ratio precio/ingreso tiene efecto negativo
            }
        };
        
        // Actualizar estado del modelo
        document.getElementById('model-status').textContent = 'Modelo entrenado correctamente';
        document.getElementById('model-status').className = 'status trained';
        
        // Actualizar métricas del modelo (simuladas)
        document.getElementById('model-accuracy').textContent = '82.5%';
        document.getElementById('model-precision').textContent = '79.3%';
        document.getElementById('model-recall').textContent = '76.8%';
        
        // Predecir para el producto seleccionado
        predictProductResponse();
        
        // Generar predicciones para todos los productos
        generateAllPredictions();
    }, 1500);
}

// Función para predecir la respuesta a un producto
function predictProductResponse() {
    if (!model || !selectedProduct) {
        document.getElementById('prediction-result').textContent = 'Entrene el modelo primero';
        document.getElementById('prediction-probability').textContent = '-';
        return;
    }
    
    // Obtener segmentos de clientes filtrados
    const segments = getCustomerSegments();
    
    // Calcular predicciones para cada segmento
    const predictions = segments.map(segment => {
        const probability = predictProbabilityForSegment(segment, selectedProduct);
        return {
            segment: segment.name,
            probability: probability,
            count: segment.count,
            expectedResponders: Math.round(segment.count * probability / 100)
        };
    });
    
    // Calcular predicción global (promedio ponderado)
    const totalCustomers = segments.reduce((sum, segment) => sum + segment.count, 0);
    const weightedProbability = predictions.reduce((sum, pred) => {
        return sum + (pred.probability * pred.count / totalCustomers);
    }, 0);
    
    // Actualizar resultados de predicción
    document.getElementById('prediction-result').textContent = 
        weightedProbability > 50 ? 'Alta probabilidad de respuesta' : 
        weightedProbability > 30 ? 'Probabilidad media de respuesta' : 'Baja probabilidad de respuesta';
    
    document.getElementById('prediction-probability').textContent = `${weightedProbability.toFixed(1)}%`;
    
    // Actualizar la clase del resultado para cambiar el color
    const resultElement = document.getElementById('prediction-result');
    if (weightedProbability > 50) {
        resultElement.className = 'high-probability';
    } else if (weightedProbability > 30) {
        resultElement.className = 'medium-probability';
    } else {
        resultElement.className = 'low-probability';
    }
    
    // Actualizar tabla de segmentos
    updateSegmentTable(predictions);
    
    // Actualizar gráfico de predicción
    updatePredictionChart(predictions);
}

// Función para obtener segmentos de clientes
function getCustomerSegments() {
    // En una implementación real, estos segmentos se calcularían dinámicamente
    // basados en los datos filtrados actuales
    return [
        {
            name: 'Jóvenes Profesionales',
            count: Math.round(filteredData.filter(c => c.Age < 40 && c.Income > 60000).length),
            avgAge: 35,
            avgIncome: 75000,
            avgSpending: 850,
            avgRecency: 15,
            hasChildren: 0.2,
            webPurchaseRatio: 0.6,
            categoryAffinities: {
                'Vinos': 0.4,
                'Frutas': 0.5,
                'Carne': 0.6,
                'Pescado': 0.4,
                'Dulces': 0.3,
                'Oro': 0.2,
                'Gourmet': 0.7,
                'Electrónica': 0.8,
                'Belleza': 0.6,
                'Moda': 0.7,
                'Hogar': 0.5,
                'Experiencias': 0.8,
                'Cultura': 0.6,
                'Deportes': 0.7
            }
        },
        {
            name: 'Familias Establecidas',
            count: Math.round(filteredData.filter(c => (c.Kidhome > 0 || c.Teenhome > 0) && c.Age >= 35 && c.Age <= 55).length),
            avgAge: 45,
            avgIncome: 65000,
            avgSpending: 1200,
            avgRecency: 20,
            hasChildren: 1,
            webPurchaseRatio: 0.4,
            categoryAffinities: {
                'Vinos': 0.5,
                'Frutas': 0.8,
                'Carne': 0.7,
                'Pescado': 0.6,
                'Dulces': 0.7,
                'Oro': 0.3,
                'Gourmet': 0.6,
                'Electrónica': 0.7,
                'Belleza': 0.5,
                'Moda': 0.6,
                'Hogar': 0.8,
                'Experiencias': 0.7,
                'Cultura': 0.5,
                'Deportes': 0.6
            }
        },
        {
            name: 'Seniors Acomodados',
            count: Math.round(filteredData.filter(c => c.Age > 55 && c.Income > 50000).length),
            avgAge: 65,
            avgIncome: 70000,
            avgSpending: 950,
            avgRecency: 25,
            hasChildren: 0.1,
            webPurchaseRatio: 0.2,
            categoryAffinities: {
                'Vinos': 0.8,
                'Frutas': 0.6,
                'Carne': 0.5,
                'Pescado': 0.7,
                'Dulces': 0.4,
                'Oro': 0.6,
                'Gourmet': 0.8,
                'Electrónica': 0.3,
                'Belleza': 0.4,
                'Moda': 0.5,
                'Hogar': 0.7,
                'Experiencias': 0.6,
                'Cultura': 0.7,
                'Deportes': 0.3
            }
        },
        {
            name: 'Jóvenes Presupuesto Limitado',
            count: Math.round(filteredData.filter(c => c.Age < 35 && c.Income < 40000).length),
            avgAge: 28,
            avgIncome: 32000,
            avgSpending: 350,
            avgRecency: 30,
            hasChildren: 0.3,
            webPurchaseRatio: 0.7,
            categoryAffinities: {
                'Vinos': 0.3,
                'Frutas': 0.6,
                'Carne': 0.4,
                'Pescado': 0.3,
                'Dulces': 0.6,
                'Oro': 0.1,
                'Gourmet': 0.3,
                'Electrónica': 0.6,
                'Belleza': 0.5,
                'Moda': 0.7,
                'Hogar': 0.4,
                'Experiencias': 0.5,
                'Cultura': 0.6,
                'Deportes': 0.5
            }
        },
        {
            name: 'Compradores Premium',
            count: Math.round(filteredData.filter(c => c.TotalSpending > 1500).length),
            avgAge: 50,
            avgIncome: 95000,
            avgSpending: 2200,
            avgRecency: 10,
            hasChildren: 0.4,
            webPurchaseRatio: 0.5,
            categoryAffinities: {
                'Vinos': 0.9,
                'Frutas': 0.7,
                'Carne': 0.8,
                'Pescado': 0.8,
                'Dulces': 0.7,
                'Oro': 0.8,
                'Gourmet': 0.9,
                'Electrónica': 0.7,
                'Belleza': 0.8,
                'Moda': 0.8,
                'Hogar': 0.7,
                'Experiencias': 0.9,
                'Cultura': 0.8,
                'Deportes': 0.7
            }
        }
    ];
}

// Función para predecir la probabilidad para un segmento y producto
function predictProbabilityForSegment(segment, product) {
    if (!model) return 0;
    
    // Calcular el score logístico
    let score = model.intercept;
    
    // Añadir contribución de cada característica
    score += model.coefficients.age * segment.avgAge;
    score += model.coefficients.income * segment.avgIncome;
    score += model.coefficients.totalSpending * segment.avgSpending;
    score += model.coefficients.recency * segment.avgRecency;
    score += model.coefficients.children * segment.hasChildren;
    score += model.coefficients.webPurchases * segment.webPurchaseRatio;
    
    // Afinidad a la categoría
    const categoryAffinity = segment.categoryAffinities[product.category] || 0.1;
    score += model.coefficients.categoryAffinity * categoryAffinity;
    
    // Ratio precio/ingreso
    const priceRatio = (product.price / segment.avgIncome) * 1000;
    score += model.coefficients.priceRatio * priceRatio;
    
    // Convertir score a probabilidad usando la función logística
    const probability = 100 / (1 + Math.exp(-score));
    
    // Añadir un poco de ruido aleatorio para simular variabilidad
    const noise = (Math.random() - 0.5) * 10;
    return Math.max(0, Math.min(100, probability + noise));
}

// Función para actualizar la tabla de segmentos
function updateSegmentTable(predictions) {
    const tableBody = document.querySelector('#segment-prediction-table tbody');
    tableBody.innerHTML = '';
    
    predictions.forEach(pred => {
        const row = document.createElement('tr');
        
        // Crear celdas para cada columna
        row.innerHTML = `
            <td>${pred.segment}</td>
            <td>${pred.count}</td>
            <td>${pred.probability.toFixed(1)}%</td>
            <td>${pred.expectedResponders}</td>
        `;
        
        // Añadir clase según la probabilidad
        if (pred.probability > 50) {
            row.classList.add('high-probability-row');
        } else if (pred.probability > 30) {
            row.classList.add('medium-probability-row');
        } else {
            row.classList.add('low-probability-row');
        }
        
        tableBody.appendChild(row);
    });
}

// Función para actualizar el gráfico de predicción
function updatePredictionChart(predictions) {
    // Destruir gráfico existente si hay uno
    if (charts.segmentPrediction) {
        charts.segmentPrediction.destroy();
    }
    
    const ctx = document.getElementById('segment-prediction-chart').getContext('2d');
    charts.segmentPrediction = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: predictions.map(pred => pred.segment),
            datasets: [{
                label: 'Probabilidad de Respuesta (%)',
                data: predictions.map(pred => pred.probability),
                backgroundColor: predictions.map(pred => {
                    if (pred.probability > 50) return 'rgba(75, 192, 192, 0.7)';
                    if (pred.probability > 30) return 'rgba(255, 206, 86, 0.7)';
                    return 'rgba(255, 99, 132, 0.7)';
                }),
                borderColor: predictions.map(pred => {
                    if (pred.probability > 50) return 'rgb(75, 192, 192)';
                    if (pred.probability > 30) return 'rgb(255, 206, 86)';
                    return 'rgb(255, 99, 132)';
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Probabilidad (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Segmento de Cliente'
                    }
                }
            }
        }
    });
}

// Función para generar predicciones para todos los productos
function generateAllPredictions() {
    if (!model) return;
    
    // Obtener segmentos de clientes
    const segments = getCustomerSegments();
    const totalCustomers = segments.reduce((sum, segment) => sum + segment.count, 0);
    
    // Calcular predicciones para cada producto
    predictionResults = productList.map(product => {
        // Calcular predicciones para cada segmento
        const segmentPredictions = segments.map(segment => {
            const probability = predictProbabilityForSegment(segment, product);
            return {
                segment: segment.name,
                probability: probability,
                count: segment.count,
                expectedResponders: Math.round(segment.count * probability / 100)
            };
        });
        
        // Calcular predicción global (promedio ponderado)
        const weightedProbability = segmentPredictions.reduce((sum, pred) => {
            return sum + (pred.probability * pred.count / totalCustomers);
        }, 0);
        
        // Calcular total de respuestas esperadas
        const totalExpectedResponders = segmentPredictions.reduce((sum, pred) => {
            return sum + pred.expectedResponders;
        }, 0);
        
        return {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            probability: weightedProbability,
            expectedResponders: totalExpectedResponders,
            segmentPredictions: segmentPredictions
        };
    });
    
    // Ordenar por probabilidad descendente
    predictionResults.sort((a, b) => b.probability - a.probability);
    
    // Actualizar tabla de productos
    updateProductsTable();
    
    // Actualizar gráfico de categorías
    updateCategoryChart();
    
    // Si la integración SQL está disponible, mostrar mensaje
    if (window.sqlIntegration) {
        console.log('Predicciones generadas. Puede guardarlas en la base de datos SQL.');
    }
}

// Función para actualizar la tabla de productos
function updateProductsTable() {
    const tableBody = document.querySelector('#products-prediction-table tbody');
    tableBody.innerHTML = '';
    
    // Mostrar solo los primeros 20 productos para rendimiento
    const displayProducts = predictionResults.slice(0, 20);
    
    displayProducts.forEach(product => {
        const row = document.createElement('tr');
        
        // Crear celdas para cada columna
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.probability.toFixed(1)}%</td>
            <td>${product.expectedResponders}</td>
        `;
        
        // Añadir clase según la probabilidad
        if (product.probability > 50) {
            row.classList.add('high-probability-row');
        } else if (product.probability > 30) {
            row.classList.add('medium-probability-row');
        } else {
            row.classList.add('low-probability-row');
        }
        
        tableBody.appendChild(row);
    });
}

// La función updateTopProductsChart ha sido eliminada ya que no se necesita

// Función para actualizar el gráfico de categorías
function updateCategoryChart() {
    // Destruir gráfico existente si hay uno
    if (charts.categoryPrediction) {
        charts.categoryPrediction.destroy();
    }
    
    // Agrupar productos por categoría y calcular promedio
    const categoryData = {};
    predictionResults.forEach(product => {
        if (!categoryData[product.category]) {
            categoryData[product.category] = {
                totalProbability: 0,
                count: 0,
                totalExpectedResponders: 0
            };
        }
        categoryData[product.category].totalProbability += product.probability;
        categoryData[product.category].count++;
        categoryData[product.category].totalExpectedResponders += product.expectedResponders;
    });
    
    // Calcular promedios y preparar datos para el gráfico
    const categories = Object.keys(categoryData);
    const avgProbabilities = categories.map(category => {
        return categoryData[category].totalProbability / categoryData[category].count;
    });
    
    const ctx = document.getElementById('category-prediction-chart').getContext('2d');
    charts.categoryPrediction = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Probabilidad Media de Respuesta (%)',
                data: avgProbabilities,
                backgroundColor: categories.map((_, index) => {
                    const probability = avgProbabilities[index];
                    if (probability > 50) return 'rgba(75, 192, 192, 0.7)';
                    if (probability > 30) return 'rgba(255, 206, 86, 0.7)';
                    return 'rgba(255, 99, 132, 0.7)';
                }),
                borderColor: categories.map((_, index) => {
                    const probability = avgProbabilities[index];
                    if (probability > 50) return 'rgb(75, 192, 192)';
                    if (probability > 30) return 'rgb(255, 206, 86)';
                    return 'rgb(255, 99, 132)';
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Probabilidad (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Categoría de Producto'
                    }
                }
            }
        }
    });
}