const path = require('path');

module.exports = {
    entry: './src/ReactLoader.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'ReactLoader.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: {
        requirejs: "requirejs"
    }
};