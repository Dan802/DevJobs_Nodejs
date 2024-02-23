function mostrarTrabajos(req, res) {
    
    res.render('home', {
        page : 'devJobs',
        tagline: 'Encuentra y Pública trabajos para desarrolladores web',
        barra: true,
        boton: true
    })
}

export default {
    mostrarTrabajos
}