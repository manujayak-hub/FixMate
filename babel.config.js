module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv', // Plugin for importing environment variables
        {
          moduleName: '@env', // Name of the module to import env variables from
          path: '.env', // Path to the .env file
          safe: false, // Optional: If set to true, will check for the existence of variables
          allowUndefined: true, // Optional: If set to true, allows undefined variables in your .env file
        },
      ],
      // Add other Babel plugins here if needed
    ],
  };
};
