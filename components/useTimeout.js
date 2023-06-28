


const useTimeout = (func) => {
    const timeout = 3000;
  
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const error = new Error(`Function Timeout ${timer} exceeded`);
        reject(error);
      }, timeout);
  
      func()
        .then(() => {
          clearTimeout(timer);
          resolve();
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  };
  
module.exports = useTimeout
  