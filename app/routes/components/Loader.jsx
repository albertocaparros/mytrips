function Loader({ loading }) {
  return (
    <span
      className='loader'
      style={{ display: loading ? 'block' : 'none' }}></span>
  );
}

export default Loader;
