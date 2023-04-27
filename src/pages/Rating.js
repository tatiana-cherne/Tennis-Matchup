export default function Rating(props) {
  const { loggedIn } = props;

  return (
    <div class="card col-md-9 mt-4">
      <div class="card-body ">
        <h5 class="card-title">Add Rating</h5>
        <form method="POST" action="/submit-ratings">
          <div class="form-group">
            <label for="player_id">Player ID:</label>
            <input type="text" id="player_id" name="player_id" class="form-control" required/>
          </div>
          <div class="form-group">
            <label for="activity_id">Activity ID:</label>
            <input type="text" id="activity_id" name="activity_id" class="form-control" required/>
          </div>
          <div class="form-group">
            <label for="rating">Rating:</label>
            <div class="btn-group-toggle" data-toggle="buttons">
              <label class="btn btn-secondary">
                <input type="radio" name="rating" value="2.5"/> 2.5
              </label>
              <label class="btn btn-secondary">
                <input type="radio" name="rating" value="3"/> 3
              </label>
              <label class="btn btn-secondary">
                <input type="radio" name="rating" value="3.5"/> 3.5
              </label>
              <label class="btn btn-secondary">
                <input type="radio" name="rating" value="4"/> 4
              </label>
              <label class="btn btn-secondary">
                <input type="radio" name="rating" value="4.5"/> 4.5
              </label>
              <label class="btn btn-secondary">
                <input type="radio" name="rating" value="5"/> 5
              </label>
            </div>
          </div>
          <div class="form-group">
            <label for="comments">Comments:</label>
            <textarea id="comments" name="comments" class="form-control" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
        <div class="text-muted mt-3">
          <span>Reminder, player is currently rated [PLACEHOLDER]</span>
        </div>
      </div>
    </div>
  )}
