import path from 'path'

export default {
    mode: 'development',
    entry: {
        app: './public/js/app.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/dist') //Detecta la ruta absoluta
    },
    module: {
        rules: [    
          {
            test: /\.m?js$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
    }
}