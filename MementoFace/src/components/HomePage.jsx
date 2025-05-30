import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Memento</h1>

      <div className="homepage-section">
        <h3>About</h3>
        <p>
          Memento is for creating long lasting
          memories with those you love.
          
        </p>
      </div>

      <div className="homepage-section">
        <h3>Goals</h3>
        <p>
          Our Goal is to allow you to remember as much
          as possible as simply impossible.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
