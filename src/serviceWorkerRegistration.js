export const register = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/serviceWorker.js').then(registration => {
        // Registeration successfull is control is here!
      }).catch((err) => {
        console.log(err)
      })
    })
  }
}


