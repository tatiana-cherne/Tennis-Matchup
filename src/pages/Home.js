export default function Home() {
  return (
    <div className="home">
      <div className="image-container">
        <img src="nyc.jpg" alt="New York City" className="full-width" />
        <div className="overlay-text">
          Welcome to Tennis Matchup in NYC! 
          <br/>We're here to help you find a compatible tennis partner.
        </div>
      </div>
    </div>
  );
}