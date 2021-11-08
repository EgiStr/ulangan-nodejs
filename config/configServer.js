export default function(app,mongoose,config){
    function dbCheck() {
        // ERR_CONNECTING_TO_MONGO
        if (
          mongoose.connection.readyState === 0 ||
          mongoose.connection.readyState === 3
        ) {
          return Promise.reject(new Error('Mongoose has disconnected'));
        }
        // CONNECTING_TO_MONGO
        if (mongoose.connection.readyState === 2) {
          return Promise.reject(new Error('Mongoose is connecting'));
        }
        // CONNECTED_TO_MONGO
        return Promise.resolve();
      }
      
}