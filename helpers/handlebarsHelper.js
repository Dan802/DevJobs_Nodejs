export function seleccionarSkills(seleccionadas = [], opciones) {

    const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress']

    let html = ""

    skills.forEach(skill => {
        html += `<li ${seleccionadas.includes(skill) ? 'class="activo"' : ''}>${skill}</li>`
    })

    // opciones.fn() es lo que irá dentro de {{#seleccionarskill}}s en el archivo de views
    // opciones.fn() esta mas relacionado a handlebars que a js vanilla
    return opciones.fn({html});
    //// return opciones.fn().html = html; // obsolet
}

export function tipoContrato (seleccionado, opciones) {

    const expresionRegular = new RegExp(`value="${seleccionado}"`) 

    // opciones.fn(this) // Es el cuerpo que hay una vez llamada la funcion en views handlebars
    // $& simil to += o [...original]
    // return: Volvemos a devolver el mismo cuerpo pero con una opcion seleccionada
    return opciones.fn(this).replace(expresionRegular, '$& selected = "selected"') 
}

export function mostrarAlertas(errores =  {}, alertas) {

    // errores = { loginErrors: ['', ''], logoutErrors: ['', '']} 
    // Los errores se almacenan en los controladores con req.flash
    // Los errores se envian en los controladores con res.render('vista', {mensajes: req.flash()})
    // Y en main.handlebars esta la función para llamar a este middleware helper
    
    const categoria = Object.keys(errores)

    let html = '';

    if(categoria.length) {
        errores[categoria].forEach(error => {
            html += `
            <div class="${categoria} alerta">
                ${error}
            </div>`
        })
    }

    return alertas.fn({html})
}