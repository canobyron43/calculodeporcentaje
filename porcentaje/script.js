/**
 * =========================================================================
 * LOGICA DE NEGOCIO Y DIDÁCTICA: PORCENTAJES DE DESCUENTO
 * =========================================================================
 */

function calcularDescuento() {
    // 1. OBTENCIÓN DE DATOS
    const precioOriginal = parseFloat(document.getElementById('precioOriginal').value);
    const porcentajeDescuento = parseFloat(document.getElementById('porcentajeDescuento').value);

    // Reiniciar errores
    const errorDiv = document.getElementById('errorDiv');
    errorDiv.style.display = 'none';
    errorDiv.innerHTML = '';

    // 2. VALIDACIONES DIDÁCTICAS Y TÉCNICAS
    if (isNaN(precioOriginal) || isNaN(porcentajeDescuento)) {
        mostrarError('Debe ingresar tanto el precio como el porcentaje de descuento.');
        return;
    }

    if (precioOriginal <= 0) {
        mostrarError('El precio original del producto debe ser un número mayor a cero.');
        return;
    }

    if (porcentajeDescuento < 0 || porcentajeDescuento > 100) {
        mostrarError('El porcentaje de descuento comercial debe estar comprendido entre 0% y 100%.');
        return;
    }

    // 3. ALGORITMO MATEMÁTICO
    const dineroAhorrado = (precioOriginal * porcentajeDescuento) / 100;
    const precioFinal = precioOriginal - dineroAhorrado;
    
    // Porcentaje que efectivamente paga el cliente (Complemento)
    const porcentajePagado = 100 - porcentajeDescuento; 
    const factorMultiplicador = porcentajePagado / 100;

    // Filtro de decimales para evitar desbordamiento visual
    const rPrecio = filtrarDecimales(precioOriginal);
    const rPorcentaje = filtrarDecimales(porcentajeDescuento);
    const rAhorro = filtrarDecimales(dineroAhorrado);
    const rFinal = filtrarDecimales(precioFinal);
    const rFactor = filtrarDecimales(factorMultiplicador);
    const rPctPagado = filtrarDecimales(porcentajePagado);

    // 4. DESARROLLO PASO A PASO
    let pasosHtml = `
        <div class="step"><strong>Paso 1 (Calcular el ahorro):</strong> Multiplicamos el precio por el porcentaje y lo dividimos en 100:<br>
        Ahorro = (${rPrecio} × ${rPorcentaje}) ÷ 100 = <strong>$${rAhorro}</strong></div>
        
        <div class="step"><strong>Paso 2 (Calcular precio final):</strong> Restamos el valor del ahorro al precio original del artículo:<br>
        Precio Final = ${rPrecio} − ${rAhorro} = <strong>$${rFinal}</strong></div>
    `;
    document.getElementById('htmlPasos').innerHTML = pasosHtml;

    // 5. EXPLICACIÓN DEL FACTOR MULTIPLICADOR (Método avanzado/rápido)
    document.getElementById('htmlFactor').innerHTML = `
        Si te descuentan el ${rPorcentaje}%, significa que pagas el ${rPctPagado}% del total.<br>
        En decimales esto equivale a un factor de <strong>${rFactor}</strong>.<br>
        <span style="color: var(--success-color); font-weight:bold;">Método directo:</span> ${rPrecio} × ${rFactor} = <strong>$${rFinal}</strong>
    `;

    // 6. INTERPRETACIÓN DEL RESULTADO
    document.getElementById('htmlInterpretacion').innerHTML = `
        <strong>Análisis comercial:</strong> Al aplicar una rebaja del <strong>${rPorcentaje}%</strong> a un producto de 
        $${rPrecio}, estás dejando de pagar <strong>$${rAhorro}</strong> (Dinero que se queda en tu bolsillo). <br><br>
        Por lo tanto, el desembolso real en caja que debes realizar para adquirir el artículo es de 
        <strong style="color: var(--success-color); font-size:1.1rem;">$${rFinal}</strong>.
    `;

    // 7. TABLA DE VALORES RESUMEN
    let tbody = document.getElementById('tbodyValores');
    tbody.innerHTML = `
        <tr><td><b>Precio Original</b></td><td>100%</td><td>$${rPrecio}</td></tr>
        <tr style="color: #db2777;"><td><b>Descuento (Ahorro)</b></td><td>${rPorcentaje}%</td><td>-$${rAhorro}</td></tr>
        <tr style="color: #16a34a; font-weight: bold; background-color: #f0fdf4;"><td><b>Precio Final (Pagas)</b></td><td>${rPctPagado}%</td><td>$${rFinal}</td></tr>
    `;

    // 8. RENDERIZADO DEL GRÁFICO SVG OFFLINE (Barra de proporción acumulada)
    dibujarGraficoDistribucion(porcentajeDescuento, porcentajePagado, rAhorro, rFinal);

    // Mostrar sección de resultados
    document.getElementById('placeholder').style.display = 'none';
    document.getElementById('output').style.display = 'block';
}

function filtrarDecimales(num) {
    if (num % 1 === 0) return num;
    return parseFloat(num.toFixed(2)); // En dinero lo normal son 2 decimales
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('errorDiv');
    errorDiv.innerHTML = '<strong>¡Atención técnica!</strong> ' + mensaje;
    errorDiv.style.display = 'block';
    document.getElementById('output').style.display = 'none';
    document.getElementById('placeholder').style.display = 'block';
}

function limpiar() {
    document.getElementById('precioOriginal').value = '';
    document.getElementById('porcentajeDescuento').value = '';
    document.getElementById('errorDiv').style.display = 'none';
    document.getElementById('output').style.display = 'none';
    document.getElementById('placeholder').style.display = 'block';
}

/**
 * Genera una barra comparativa segmentada dinámicamente mediante SVG nativo
 */
function dibujarGraficoDistribucion(pctDescuento, pctPagado, vAhorro, vPagas) {
    const contenedorG = document.getElementById('dinamicoSvg');
    contenedorG.innerHTML = ''; // Limpiar gráfico anterior

    const svgNS = "http://www.w3.org/2000/svg";
    
    // Ancho total disponible para la barra de porcentaje = 310 píxeles
    const anchoMaximoBarra = 310;
    const xInicial = 20;
    const yBarra = 60;
    const altoBarra = 30;

    // Calcular proporciones físicas de los segmentos de barra
    const anchoPagas = (pctPagado / 100) * anchoMaximoBarra;
    const anchoDescuento = (pctDescuento / 100) * anchoMaximoBarra;

    // 1. SEGMENTO: LO QUE PAGAS (Verde)
    if (anchoPagas > 0) {
        const rectPagas = document.createElementNS(svgNS, "rect");
        rectPagas.setAttribute("x", xInicial);
        rectPagas.setAttribute("y", yBarra);
        rectPagas.setAttribute("width", anchoPagas);
        rectPagas.setAttribute("height", altoBarra);
        rectPagas.setAttribute("fill", "#16a34a");
        contenedorG.appendChild(rectPagas);

        // Texto informativo del segmento de pago
        const txtPagas = document.createElementNS(svgNS, "text");
        txtPagas.setAttribute("x", xInicial + (anchoPagas / 2));
        txtPagas.setAttribute("y", yBarra + 20);
        txtPagas.setAttribute("fill", "#ffffff");
        txtPagas.setAttribute("font-size", "11");
        txtPagas.setAttribute("font-weight", "bold");
        txtPagas.setAttribute("text-anchor", "middle");
        txtPagas.textContent = `${filtrarDecimales(pctPagado)}%`;
        if (anchoPagas > 35) contenedorG.appendChild(txtPagas); // Solo añadir si cabe
    }

    // 2. SEGMENTO: LO QUE AHORRAS (Fucsia/Descuento)
    if (anchoDescuento > 0) {
        const rectDesc = document.createElementNS(svgNS, "rect");
        rectDesc.setAttribute("x", xInicial + anchoPagas);
        rectDesc.setAttribute("y", yBarra);
        rectDesc.setAttribute("width", anchoDescuento);
        rectDesc.setAttribute("height", altoBarra);
        rectDesc.setAttribute("fill", "#db2777");
        contenedorG.appendChild(rectDesc);

        // Texto informativo del segmento de descuento
        const txtDesc = document.createElementNS(svgNS, "text");
        txtDesc.setAttribute("x", xInicial + anchoPagas + (anchoDescuento / 2));
        txtDesc.setAttribute("y", yBarra + 20);
        txtDesc.setAttribute("fill", "#ffffff");
        txtDesc.setAttribute("font-size", "11");
        txtDesc.setAttribute("font-weight", "bold");
        txtDesc.setAttribute("text-anchor", "middle");
        txtDesc.textContent = `${filtrarDecimales(pctDescuento)}%`;
        if (anchoDescuento > 35) contenedorG.appendChild(txtDesc);
    }

    // 3. ETIQUETAS EXTERNAS DE REFERENCIA (LEYENDA NUMÉRICA)
    // Etiqueta Pago
    const leyendaPagas = document.createElementNS(svgNS, "text");
    leyendaPagas.setAttribute("x", xInicial);
    leyendaPagas.setAttribute("y", yBarra - 15);
    leyendaPagas.setAttribute("fill", "#16a34a");
    leyendaPagas.setAttribute("font-size", "11");
    leyendaPagas.setAttribute("font-weight", "600");
    leyendaPagas.textContent = `Pagas: $${vPagas}`;
    contenedorG.appendChild(leyendaPagas);

    // Etiqueta Ahorro
    const leyendaAhorro = document.createElementNS(svgNS, "text");
    leyendaAhorro.setAttribute("x", xInicial + anchoMaximoBarra);
    leyendaAhorro.setAttribute("y", yBarra - 15);
    leyendaAhorro.setAttribute("fill", "#db2777");
    leyendaAhorro.setAttribute("font-size", "11");
    leyendaAhorro.setAttribute("font-weight", "600");
    leyendaAhorro.setAttribute("text-anchor", "end");
    leyendaAhorro.textContent = `Ahorras: $${vAhorro}`;
    contenedorG.appendChild(leyendaAhorro);
    
    // Indicador del 100% total en la parte inferior
    const leyendaTotal = document.createElementNS(svgNS, "text");
    leyendaTotal.setAttribute("x", xInicial + (anchoMaximoBarra / 2));
    leyendaTotal.setAttribute("y", yBarra + altoBarra + 20);
    leyendaTotal.setAttribute("fill", "#64748b");
    leyendaTotal.setAttribute("font-size", "11");
    leyendaTotal.setAttribute("text-anchor", "middle");
    leyendaTotal.textContent = `Largo de barra = 100% del Valor del Producto`;
    contenedorG.appendChild(leyendaTotal);
}