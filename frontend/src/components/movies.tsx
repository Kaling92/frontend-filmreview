type MovieProps = {
  user?: unknown;
};

function Movie({ user }: MovieProps) {
  return (
    <div className="App">
      <h2>Movie</h2>
      <p>{user ? 'Signed in' : 'Not signed in'}</p>
    </div>
  );
}

export default Movie