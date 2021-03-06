const loaderDiv = document.querySelector('.spinnerDiv');

const loadBody = () => {
  loaderDiv.style.display = 'block';
  window.addEventListener('load', () => {
    loaderDiv.style.display = 'none';
  });
};

export default loadBody;